import { SlashCommandBuilder } from "discord.js";
import db from "../db.js";
import { TOY_ITEMS } from "../data/toyItems.js";

export default {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play with one of your pets using a toy")
        .addIntegerOption(opt =>
            opt.setName("pet")
               .setDescription("The pet number from /mypets")
               .setRequired(true)
        )
        .addStringOption(opt =>
            opt.setName("toy")
               .setDescription("Which toy to use")
               .setRequired(true)
               .addChoices(
                    { name: "🎾 Ball (-20 boredom)", value: "ball" },
                    { name: "🧸 Toy Mouse (-40 boredom)", value: "mouse" },
                    { name: "🎁 Deluxe Toy (-100 boredom)", value: "deluxe" }
               )
        ),

    async run(interaction) {
        const user = db.ensureUser(interaction.user.id);
        const petIndex = interaction.options.getInteger("pet") - 1;
        const toyKey = interaction.options.getString("toy");

        if (!user.pets || user.pets.length === 0) {
            return interaction.reply("You don't have any pets to play with.");
        }

        if (petIndex < 0 || petIndex >= user.pets.length) {
            return interaction.reply(`Invalid pet number. You have **${user.pets.length}** pets.`);
        }

        const pet = user.pets[petIndex];
        const toy = TOY_ITEMS[toyKey];

        // Auto‑fix missing boredom fields
        if (typeof pet.boredom !== "number") pet.boredom = 0;
        if (!pet.lastPlayed) pet.lastPlayed = Date.now();

        // Check inventory
        if (!user.items || !user.items[toyKey] || user.items[toyKey] <= 0) {
            return interaction.reply(`You don't have a **${toy.emoji} ${toy.name}**.`);
        }

        // Apply boredom reduction
        pet.boredom = Math.max(0, pet.boredom - toy.reduce);
        pet.lastPlayed = Date.now();

        // Consume toy
        user.items[toyKey]--;
        if (user.items[toyKey] < 0) user.items[toyKey] = 0;

        // XP reward
        pet.xp += 5;
        if (pet.xp >= 100) {
            pet.level++;
            pet.xp = 0;
        }

        db.save();

        await interaction.reply(
            `${toy.emoji} You played with **${pet.name || "your pet"}**!\n` +
            `Boredom reduced by **${toy.reduce}**.\n` +
            `Current boredom: **${pet.boredom}/100**\n` +
            `XP gained: **5**`
        );
    }
};
