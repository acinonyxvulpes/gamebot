import { SlashCommandBuilder } from "discord.js";
import db from "../db.js";

export default {
    data: new SlashCommandBuilder()
        .setName("profile")
        .setDescription("View your pet profile and stats"),

    async run(interaction) {
        const user = db.ensureUser(interaction.user.id);

        const coins = user.coins;
        const totalPets = user.pets.length;

        let activePetText = "You don't have any pets yet!";
        let progressBar = "";

        if (totalPets > 0) {
            const pet = user.pets[user.activePet];

            const xpNeeded = pet.level * 20;
            const percent = Math.min(100, Math.floor((pet.xp / xpNeeded) * 100));

            // Create a simple progress bar
            const filled = Math.floor(percent / 10);
            const empty = 10 - filled;
            progressBar = "█".repeat(filled) + "░".repeat(empty);

            activePetText = `
**${pet.emoji} Active Pet**
Level: **${pet.level}**
XP: **${pet.xp}/${xpNeeded}**
Progress: \`${progressBar}\` ${percent}%
`;
        }

        await interaction.reply(
`🐾 **Your Profile**
**Coins:** ${coins}
**Total Pets:** ${totalPets}

${activePetText}`
        );
    }
};
