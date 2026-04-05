import { SlashCommandBuilder } from "discord.js";
import db from "../db.js";

export default {
    data: new SlashCommandBuilder()
        .setName("mypets")
        .setDescription("Show all your pets"),

    async run(interaction) {
        const user = db.ensureUser(interaction.user.id);

        if (user.pets.length === 0)
            return interaction.reply("You don't have any pets yet!");

        const list = user.pets
            .map(p => `${p.emoji} (Lvl ${p.level})`)
            .join("\n");

        await interaction.reply(`Your pets:\n${list}`);
    }
};
