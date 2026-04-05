import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { FOOD_ITEMS, RARE_PETS } from "../data/shopItems.js";

export default {
    data: new SlashCommandBuilder()
        .setName("shop")
        .setDescription("View the pet shop"),

    async run(interaction) {
        let foodButtons = new ActionRowBuilder();
        let petButtons = new ActionRowBuilder();

        // Food buttons
        for (const key in FOOD_ITEMS) {
            const item = FOOD_ITEMS[key];
            foodButtons.addComponents(
                new ButtonBuilder()
                    .setCustomId(`buy_food_${key}`)
                    .setLabel(`${item.emoji} ${item.name} (${item.cost} coins)`)
                    .setStyle(ButtonStyle.Primary)
            );
        }

        // Rare pet buttons
        for (const key in RARE_PETS) {
            const pet = RARE_PETS[key];
            petButtons.addComponents(
                new ButtonBuilder()
                    .setCustomId(`buy_pet_${key}`)
                    .setLabel(`${pet.emoji} ${pet.name} (${pet.cost} coins)`)
                    .setStyle(ButtonStyle.Success)
            );
        }

        await interaction.reply({
            content:
`🛒 **Pet Shop**

**Food**
Buy food to feed your pets.

**Rare Pets**
Special pets you can only get here.`,
            components: [foodButtons, petButtons]
        });
    }
};
