import { SlashCommandBuilder } from "discord.js";
import db from "../db.js";

export default {
    data: new SlashCommandBuilder()
        .setName("coins")
        .setDescription("Check your coin balance"),

    async run(interaction) {
        const user = db.ensureUser(interaction.user.id);
        await interaction.reply(`You have **${user.coins}** coins`);
    }
};
