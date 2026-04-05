export const battles = {};

export function createBattle(channelId, p1, p2) {
    battles[channelId] = {
        player1: p1,
        player2: p2,
        turn: "player1",
        waitingForAccept: true,
        p1hp: p1.stats.hp,
        p2hp: p2.stats.hp
    };
}

export function getBattle(channelId) {
    return battles[channelId];
}

export function endBattle(channelId) {
    delete battles[channelId];
}
