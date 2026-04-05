import { SlashCommandBuilder } from "discord.js";
import db from "../db.js";

export default {
    data: new SlashCommandBuilder()
        .setName("daily")
        .setDescription("Claim your daily reward"),

    async run(interaction) {
        const user = db.ensureUser(interaction.user.id);
        const now = Date.now();
        const DAY = 24 * 60 * 60 * 1000;

        if (now - user.lastDaily < DAY) {
            const remaining = DAY - (now - user.lastDaily);
            const hours = Math.ceil(remaining / (60 * 60 * 1000));
            return interaction.reply(`You already claimed your daily. Try again in ~${hours} hour(s).`);
        }

        const coinsReward = 50;
        const xpReward = 20;

        user.coins += coinsReward;

        if (user.pets.length > 0) {
            const pet = user.pets[0];
            db.addXP(pet, xpReward);
        }

        user.lastDaily = now;
        db.save();

        await interaction.reply(
            `You claimed your daily reward!\n+${coinsReward} coins\n+${xpReward} XP to your first pet`
        );
    }
};
