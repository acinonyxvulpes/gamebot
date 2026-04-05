import { SlashCommandBuilder } from "discord.js";
import db from "../db.js";

export default {
    data: new SlashCommandBuilder()
        .setName("adopt")
        .setDescription("Adopt a new pet emoji")
        .addStringOption(opt =>
            opt.setName("emoji")
               .setDescription("Choose an animal emoji")
               .setRequired(true)
        ),

    async run(interaction) {
        const emoji = interaction.options.getString("emoji");

        // Load or create user data
        const user = db.ensureUser(interaction.user.id);

        // Create new pet
        const newPet = {
            emoji,
            level: 1,
            xp: 0
        };

        // Add pet to user's collection
        user.pets.push(newPet);

        // Save database
        db.save();

        await interaction.reply(`🎉 You adopted a new pet ${emoji}!`);
    }
};
