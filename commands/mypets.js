import { SlashCommandBuilder } from "discord.js";
import db from "../db.js";

export default {
    data: new SlashCommandBuilder()
        .setName("mypets")
        .setDescription("View all your pets"),

    async run(interaction) {
        const user = db.ensureUser(interaction.user.id);

        if (!user.pets || user.pets.length === 0) {
            return interaction.reply("You don't have any pets yet! Use /adopt to get one.");
        }

        let list = "";

        user.pets.forEach((pet, i) => {
            // Safety defaults
            if (!pet.level) pet.level = 1;
            if (!pet.xp) pet.xp = 0;

            const isActive = (i === user.activePet);
            const name = pet.name ? `**${pet.name}**` : "*Unnamed*";

            list += `${isActive ? "⭐ " : ""}${i + 1}) ${pet.emoji} ${name} — Level **${pet.level}** (XP: ${pet.xp})\n`;
        });

        await interaction.reply(
`🐾 **Your Pets**
${list}`
        );
    }
};
