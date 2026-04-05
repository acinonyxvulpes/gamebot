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
        const user = db.ensureUser(interaction.user.id);

        user.pets.push({
            emoji,
            rarity: "common",
            level: 1
        });

        db.save();

        await interaction.reply(`You adopted a new pet ${emoji}`);
    }
};
