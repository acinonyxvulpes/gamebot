import { SlashCommandBuilder } from "discord.js";
import db from "../db.js";

export default {
    data: new SlashCommandBuilder()
        .setName("profile")
        .setDescription("View your pet profile and stats"),

    async run(interaction) {
        const user = db.ensureUser(interaction.user.id);

        // Safety checks to prevent crashes
        if (!Array.isArray(user.pets)) user.pets = [];
        if (typeof user.activePet !== "number") user.activePet = 0;
        if (typeof user.coins !== "number") user.coins = 0;

        const coins = user.coins;
        const totalPets = user.pets.length;

        let activePetText = "You don't have any pets yet!";
        let progressBar = "";

        if (totalPets > 0) {
            // Ensure activePet is in range
            if (user.activePet < 0 || user.activePet >= totalPets) {
                user.activePet = 0;
                db.save();
            }

            const pet = user.pets[user.activePet];

            // Ensure pet fields exist
            if (!pet.level) pet.level = 1;
            if (!pet.xp) pet.xp = 0;

            const xpNeeded = pet.level * 20;
            const percent = Math.min(100, Math.floor((pet.xp / xpNeeded) * 100));

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
