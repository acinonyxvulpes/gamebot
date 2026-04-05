import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import db from "../db.js";

export default {
    data: new SlashCommandBuilder()
        .setName("release")
        .setDescription("Release one of your pets")
        .addIntegerOption(opt =>
            opt.setName("number")
               .setDescription("The pet number from /mypets")
               .setRequired(true)
        ),

    async run(interaction) {
        const user = db.ensureUser(interaction.user.id);
        const number = interaction.options.getInteger("number");

        if (user.pets.length === 0) {
            return interaction.reply("You don't have any pets to release.");
        }

        if (number < 1 || number > user.pets.length) {
            return interaction.reply(`Invalid pet number. You have **${user.pets.length}** pets.`);
        }

        const pet = user.pets[number - 1];
        const name = pet.name ? `**${pet.name}**` : "*Unnamed*";

        // Confirmation buttons
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`release_confirm_${number}`)
                .setLabel("Release")
                .setStyle(ButtonStyle.Danger),

            new ButtonBuilder()
                .setCustomId("release_cancel")
                .setLabel("Cancel")
                .setStyle(ButtonStyle.Secondary)
        );

        await interaction.reply({
            content: `Are you sure you want to release ${pet.emoji} ${name}? This cannot be undone.`,
            components: [row]
        });
    }
};
