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
            pets: []
        };
        save();
    }
    return db.users[id];
}

export default { db, save, ensureUser };
