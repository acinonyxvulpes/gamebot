import { SlashCommandBuilder } from "discord.js";
import db from "../db.js";

const FOOD = {
    apple: { emoji: "🍎", hunger: 20, cost: 10 },
    meat: { emoji: "🍗", hunger: 50, cost: 25 },
    feast: { emoji: "🥩", hunger: 100, cost: 60 }
};

export default {
    data: new SlashCommandBuilder()
        .setName("feed")
        .setDescription("Feed one of your pets")
        .addIntegerOption(opt =>
            opt.setName("pet")
               .setDescription("The pet number from /mypets")
               .setRequired(true)
        )
        .addStringOption(opt =>
            opt.setName("food")
               .setDescription("Type of food to feed")
               .setRequired(true)
               .addChoices(
                    { name: "🍎 Apple (+20 hunger)", value: "apple" },
                    { name: "🍗 Meat (+50 hunger)", value: "meat" },
                    { name: "🥩 Feast (+100 hunger)", value: "feast" }
               )
        ),

    async run(interaction) {
        const user = db.ensureUser(interaction.user.id);
        const petIndex = interaction.options.getInteger("pet") - 1;
        const foodType = interaction.options.getString("food");

        if (!user.pets || user.pets.length === 0) {
            return interaction.reply("You don't have any pets to feed.");
        }

        if (petIndex < 0 || petIndex >= user.pets.length) {
            return interaction.reply(`Invalid pet number. You have **${user.pets.length}** pets.`);
        }

        const pet = user.pets[petIndex];
        const food = FOOD[foodType];

        // Auto‑fix missing hunger fields
        if (typeof pet.hunger !== "number") pet.hunger = 100;
        if (!pet.lastFed) pet.lastFed = Date.now();

        // Check coins
        if (user.coins < food.cost) {
            return interaction.reply(`You need **${food.cost} coins** to buy ${food.emoji}.`);
        }

        // Apply hunger
        pet.hunger = Math.min(100, pet.hunger + food.hunger);
        pet.lastFed = Date.now();

        // Deduct coins
        user.coins -= food.cost;

        db.save();

        await interaction.reply(
            `${food.emoji} You fed your pet **${pet.name || "Unnamed"}**!\n` +
            `Hunger restored by **${food.hunger}**.\n` +
            `Current hunger: **${pet.hunger}/100**`
        );
    }
};
