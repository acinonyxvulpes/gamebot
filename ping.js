import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Check if the bot is alive"),

    async run(interaction) {
        await interaction.reply("Pong!");
    }
};
