import { SlashCommandBuilder } from "discord.js";
import db from "../db.js";

export default {
    data: new SlashCommandBuilder()
        .setName("mypets")
        .setDescription("Show all your pets"),

    async run(interaction) {
        const user = db.ensureUser(interaction.user.id);

        if (user.pets.length === 0) {
            return interaction.reply("You don't have any pets yet!");
        }

        let list = user.pets
            .map((p, i) => {
                const xpNeeded = p.level * 20;
                return `**${i + 1}.** ${p.emoji} — Lvl **${p.level}** (XP: ${p.xp}/${xpNeeded})`;
            })
            .join("\n");

        await interaction.reply(`🐾 **Your Pets:**\n${list}`);
    }
};
