import { SlashCommandBuilder } from "discord.js";
import db from "../db.js";

export default {
    data: new SlashCommandBuilder()
        .setName("sayit")
        .setDescription("Start a Say-It minigame"),

    async run(interaction) {
        const words = [
            "tiger", "panther", "cheetah", "lion", "meow",
            "paws", "whiskers", "roar", "🐱", "🐯", "🐾", "🐶"
        ];

        const target = words[Math.floor(Math.random() * words.length)];

        await interaction.reply(`First person to type **${target}** wins 10 coins!`);

        const filter = msg =>
            !msg.author.bot && // ignore bots
            msg.channel.id === interaction.channel.id && // same channel
            msg.content.trim() === target; // exact match (no lowercase issues)

        const collector = interaction.channel.createMessageCollector({
            filter,
            max: 1,
            time: 15000
        });

        collector.on("collect", msg => {
            const user = db.ensureUser(msg.author.id);

            user.coins += 10;

            if (user.pets.length > 0) {
                const pet = user.pets[0];
                db.addXP(pet, 10);
            }

            db.save();

            msg.reply(`🎉 You win 10 coins and your pet gains XP, ${msg.author}!`);
        });

        collector.on("end", collected => {
            if (collected.size === 0) {
                interaction.followUp("Nobody typed it in time!");
            }
        });
    }
};
