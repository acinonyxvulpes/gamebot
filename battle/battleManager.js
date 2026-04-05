// battle/battleManager.js

export const battles = {};

export function createBattle(messageId, player1, player2) {
    battles[messageId] = {
        player1,
        player2,
        turn: "player1",
        waitingForAccept: true,
        p1hp: player1.stats.hp,
        p2hp: player2.stats.hp
    };
}

export function getBattle(messageId) {
    return battles[messageId];
}

export function endBattle(messageId) {
    delete battles[messageId];
}
