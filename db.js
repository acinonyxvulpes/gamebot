import fs from "fs";

const dbPath = "./database.json";

// Load or create database
let db;
try {
    db = JSON.parse(fs.readFileSync(dbPath, "utf8"));
} catch {
    db = { users: {} };
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

function save() {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

function ensureUser(id) {
    if (!db.users[id]) {
        db.users[id] = {
            coins: 0,
            pets: [],
            lastDaily: 0 // <-- needed for /daily
        };
        save();
    }
    return db.users[id];
}

// XP + leveling system
function addXP(pet, amount) {
    if (pet.level >= 50) return; // max level

    pet.xp += amount;

    const xpNeeded = pet.level * 20; // scaling difficulty

    if (pet.xp >= xpNeeded) {
        pet.xp -= xpNeeded;
        pet.level++;

        if (pet.level > 50) pet.level = 50;
    }
}

export default { db, save, ensureUser, addXP };
