import db from "../db.js";
import { FOOD_ITEMS, RARE_PETS } from "../data/shopItems.js";
import { TOY_ITEMS } from "../data/toyItems.js";

export default async function handleShopButtons(interaction) {
    const user = db.ensureUser(interaction.user.id);
    const id = interaction.customId;

    // BUY FOOD
    if (id.startsWith("buy_food_")) {
        const key = id.replace("buy_food_", "");
        const item = FOOD_ITEMS[key];

        if (!item) {
            return interaction.reply({ content: "Invalid item.", ephemeral: true });
        }

        if (user.coins < item.cost) {
            return interaction.reply({ content: `You need **${item.cost} coins**.`, ephemeral: true });
        }

        if (!user.inventory) user.inventory = {};
        if (!user.inventory[key]) user.inventory[key] = 0;
        user.inventory[key]++;

        user.coins -= item.cost;
        db.save();

        return interaction.reply({ content: `You bought **${item.emoji} ${item.name}**!`, ephemeral: true });
    }

    // BUY RARE PET
    if (id.startsWith("buy_pet_")) {
        const key = id.replace("buy_pet_", "");
        const pet = RARE_PETS[key];

        if (!pet) {
            return interaction.reply({ content: "Invalid pet.", ephemeral: true });
        }

        if (user.coins < pet.cost) {
            return interaction.reply({ content: `You need **${pet.cost} coins**.`, ephemeral: true });
        }

        user.pets.push({
            emoji: pet.emoji,
            name: pet.name,
            level: 1,
            xp: 0,
            hunger: 100,
            lastFed: Date.now(),
            boredom: 0,
            lastPlayed: Date.now() 
            sick: false,
sickSince: null,

        });

        user.coins -= pet.cost;
        db.save();

        return interaction.reply({ content: `🎉 You bought a **${pet.emoji} ${pet.name}**!`, ephemeral: true });
    }

    // BUY TOY
    if (id.startsWith("buy_toy_")) {
        const key = id.replace("buy_toy_", "");
        const item = TOY_ITEMS[key];

        if (!item) {
            return interaction.reply({ content: "Invalid toy.", ephemeral: true });
        }

        if (user.coins < item.cost) {
            return interaction.reply({ content: `You need **${item.cost} coins**.`, ephemeral: true });
        }

        if (!user.items) user.items = {};
        if (!user.items[key]) user.items[key] = 0;
        user.items[key]++;

        user.coins -= item.cost;
        db.save();

        return interaction.reply({ content: `You bought a **${item.emoji} ${item.name}**!`, ephemeral: true });
    }
}
