import { SlashCommandBuilder } from "discord.js";
import db from "../db.js";
import { FOOD_ITEMS } from "../data/shopItems.js";
import { TOY_ITEMS } from "../data/toyItems.js";

export default {
    data: new SlashCommandBuilder()
        .setName("inventory")
        .setDescription("View your food, items, and pets"),

    async run(interaction) {
        const user = db.ensureUser(interaction.user.id);

        // Auto-create inventory if missing
        if (!user.inventory) user.inventory = {};
        if (!user.items) user.items = {};

        // FOOD SECTION
        let foodList = "";
        for (const key in FOOD_ITEMS) {
            const item = FOOD_ITEMS[key];
            const amount = user.inventory[key] || 0;
            foodList += `${item.emoji} **${item.name}** × ${amount}\n`;
        }

        // ITEM SECTION (toys, medicine, etc.)
        let itemList = "";
        for (const key in TOY_ITEMS) {
            const item = TOY_ITEMS[key];
            const amount = user.items[key] || 0;
            itemList += `${item.emoji} **${item.name}** × ${amount}\n`;
        }

        // PET SECTION
        let petList = "";
        user.pets.forEach((pet, i) => {
            petList += `${i + 1}) ${pet.emoji} **${pet.name || "Unnamed"}** — Level ${pet.level}\n`;
        });

        await interaction.reply(
`🎒 **Your Inventory**

🍽️ **Food**
${foodList || "You have no food."}

🧸 **Items**
${itemList || "You have no items."}

🐾 **Pets**
${petList || "You have no pets."}`
        );
    }
};
