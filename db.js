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
    try {
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    } catch (err) {
        console.error("DB SAVE ERROR:", err);
    }
}

function ensureUser(id) {
    if (!db.users[id]) {
        db.users[id] = {
            coins: 0,
            pets: [],
            lastDaily: 0,
            activePet: 0
        };
        save();
    }
    return db.users[id];
}

// XP + leveling system (safe version)
function addXP(pet, amount) {
    // Ensure fields exist
    if (pet.level == null) pet.level = 1;
    if (pet.xp == null) pet.xp = 0;

    if (pet.level >= 50) return;

    pet.xp += amount;

    const xpNeeded = pet.level * 20;

    if (pet.xp >= xpNeeded) {
        pet.xp -= xpNeeded;
        pet.level++;
        if (pet.level > 50) pet.level = 50;
    }
}

export default { db, save, ensureUser, addXP };
