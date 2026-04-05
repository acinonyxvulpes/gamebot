import { SlashCommandBuilder } from "discord.js";
import db from "../db.js";

export default {
    data: new SlashCommandBuilder()
        .setName("renamepet")
        .setDescription("Rename one of your pets")
        .addIntegerOption(opt =>
            opt.setName("number")
               .setDescription("The pet number from /mypets")
               .setRequired(true)
        )
        .addStringOption(opt =>
            opt.setName("name")
               .setDescription("The new name for your pet")
               .setRequired(true)
        ),

    async run(interaction) {
        const user = db.ensureUser(interaction.user.id);
        const number = interaction.options.getInteger("number");
        const newName = interaction.options.getString("name").trim();

        if (user.pets.length === 0) {
            return interaction.reply("You don't have any pets to rename.");
        }

        if (number < 1 || number > user.pets.length) {
            return interaction.reply(`Invalid pet number. You have **${user.pets.length}** pets.`);
        }

        if (newName.length > 20) {
            return interaction.reply("Pet names must be 20 characters or fewer.");
        }

        const pet = user.pets[number - 1];
        pet.name = newName;

        db.save();

        await interaction.reply(`Your pet ${pet.emoji} is now named **${newName}**`);
    }
};
