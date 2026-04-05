import db from "../db.js";
import { battles, endBattle } from "../battle/battleManager.js";

export default async function handleBattleButtons(interaction) {
    const messageId = interaction.message.id;
    const battle = battles[messageId];

    if (!battle) {
        return interaction.reply({ content: "No active battle.", ephemeral: true });
    }

    const userId = interaction.user.id;

    // ACCEPT
    if (interaction.customId === "battle_accept") {
        if (battle.player2.id !== userId) {
            return interaction.reply({ content: "Only the challenged player can accept.", ephemeral: true });
        }

        battle.waitingForAccept = false;

        return interaction.update({
            content:
                `Battle started!\n\n` +
                `${battle.player1.pet.emoji} **${battle.player1.pet.name}** vs ` +
                `${battle.player2.pet.emoji} **${battle.player2.pet.name}**\n\n` +
                `It's **${battle.turn === "player1" ? battle.player1.pet.name : battle.player2.pet.name}'s** turn!`,
            components: battleButtons()
        });
    }

    // DECLINE
    if (interaction.customId === "battle_decline") {
        endBattle(messageId);
        return interaction.update({
            content: "Battle declined.",
            components: []
        });
    }

    // ACTIONS
    if (battle.waitingForAccept) {
        return interaction.reply({ content: "The battle hasn't started yet.", ephemeral: true });
    }

    const isP1 = battle.player1.id === userId;
    const isP2 = battle.player2.id === userId;

    if (!isP1 && !isP2) {
        return interaction.reply({ content: "You're not in this battle.", ephemeral: true });
    }

    const turn = battle.turn;
    if ((turn === "player1" && !isP1) || (turn === "player2" && !isP2)) {
        return interaction.reply({ content: "It's not your turn.", ephemeral: true });
    }

    // ATTACK
    if (interaction.customId === "battle_attack") {
        const attacker = turn === "player1" ? battle.player1 : battle.player2;
        const defender = turn === "player1" ? battle.player2 : battle.player1;

        const dmg = Math.max(1, attacker.stats.attack - defender.stats.defense / 2);

        if (turn === "player1") battle.p2hp -= dmg;
        else battle.p1hp -= dmg;

        if (battle.p1hp <= 0 || battle.p2hp <= 0) {
            const winner = battle.p1hp > 0 ? battle.player1 : battle.player2;

            const winnerUser = db.ensureUser(winner.id);
            const winnerPet = winnerUser.pets[0];
            winnerPet.xp += 20;
            winnerUser.coins += 50;
            db.save();

            endBattle(messageId);

            return interaction.update({
                content:
                    `🎉 **${winner.pet.name} wins the battle!**\n` +
                    `+20 XP\n+50 coins`,
                components: []
            });
        }

        battle.turn = turn === "player1" ? "player2" : "player1";

        return interaction.update({
            content: battleStatus(battle),
            components: battleButtons()
        });
    }

    // DEFEND
    if (interaction.customId === "battle_defend") {
        battle.turn = turn === "player1" ? "player2" : "player1";

        return interaction.update({
            content: battleStatus(battle),
            components: battleButtons()
        });
    }

    // RUN
    if (interaction.customId === "battle_run") {
        const opponent = isP1 ? battle.player2 : battle.player1;

        endBattle(messageId);

        return interaction.update({
            content: `${interaction.user.username} ran away! ${opponent.pet.name} wins!`,
            components: []
        });
    }
}

function battleButtons() {
    const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

    return [
        new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("battle_attack").setLabel("Attack").setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId("battle_defend").setLabel("Defend").setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId("battle_run").setLabel("Run").setStyle(ButtonStyle.Secondary)
        )
    ];
}

function battleStatus(battle) {
    return (
        `${battle.player1.pet.emoji} **${battle.player1.pet.name}** HP: ${battle.p1hp}\n` +
        `${battle.player2.pet.emoji} **${battle.player2.pet.name}** HP: ${battle.p2hp}\n\n` +
        `It's **${battle.turn === "player1" ? battle.player1.pet.name : battle.player2.pet.name}'s** turn!`
    );
}
