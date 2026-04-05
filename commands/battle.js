import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import db from "../db.js";
import { getPetStats } from "../utils/petStats.js";
import { createBattle } from "../battle/battleManager.js";

export default {
    data: new SlashCommandBuilder()
        .setName("battle")
        .setDescription("Challenge another player to a pet battle")
        .addUserOption(opt =>
            opt.setName("opponent")
               .setDescription("Who do you want to battle?")
               .setRequired(true)
        ),

    async run(interaction) {
        const opponent = interaction.options.getUser("opponent");

        if (opponent.id === interaction.user.id) {
            return interaction.reply("You can't battle yourself.");
        }

        const user1 = db.ensureUser(interaction.user.id);
        const user2 = db.ensureUser(opponent.id);

        if (!user1.pets.length || !user2.pets.length) {
            return interaction.reply("Both players must have at least one pet.");
        }

        const pet1 = user1.pets[0];
        const pet2 = user2.pets[0];

        const stats1 = getPetStats(pet1);
        const stats2 = getPetStats(pet2);

        createBattle(
            interaction.channelId,
            { id: interaction.user.id, pet: pet1, stats: stats1 },
            { id: opponent.id, pet: pet2, stats: stats2 }
        );

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("battle_accept")
                .setLabel("Accept")
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId("battle_decline")
                .setLabel("Decline")
                .setStyle(ButtonStyle.Danger)
        );

        await interaction.reply({
            content: `${opponent}, **${interaction.user.username}** has challenged you to a pet battle!`,
            components: [row],
            fetchReply: true // <-- THIS FIXES THE INTERACTION FAILING
        });
    }
};
