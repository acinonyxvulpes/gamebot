import { SlashCommandBuilder } from "discord.js";
import db from "../db.js";

export default {
    data: new SlashCommandBuilder()
        .setName("setpet")
        .setDescription("Choose which of your pets is your active pet")
        .addIntegerOption(opt =>
            opt.setName("number")
               .setDescription("The pet number from /mypets")
               .setRequired(true)
        ),

    async run(interaction) {
        const user = db.ensureUser(interaction.user.id);
        const number = interaction.options.getInteger("number");

        if (user.pets.length === 0) {
            return interaction.reply("You don't have any pets yet!");
        }

        if (number < 1 || number > user.pets.length) {
            return interaction.reply(`Invalid pet number. You have **${user.pets.length}** pets.`);
        }

        user.activePet = number - 1;
        db.save();

        const pet = user.pets[user.activePet];

        await interaction.reply(`Your active pet is now ${pet.emoji} (Pet #${number})`);
    }
};
