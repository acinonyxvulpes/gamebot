import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

// Import button handlers
import handleReleaseButtons from "./interactions/releaseButtons.js";
import handleShopButtons from "./interactions/shopButtons.js";
import handleBattleButtons from "./interactions/battleButtons.js"; // <-- ADD THIS

// 1. CREATE CLIENT FIRST
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// 2. LOAD COMMANDS
const commands = [];
client.commands = new Map();

const commandsPath = path.join(process.cwd(), "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(`file://${filePath}`);

    commands.push(command.default.data.toJSON());
    client.commands.set(command.default.data.name, command.default);
}

// 3. REGISTER SLASH COMMANDS
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

async function registerCommands() {
    try {
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );
        console.log("Slash commands registered");
    } catch (err) {
        console.error("Error registering commands:", err);
    }
}

// 4. READY EVENT
client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// 5. INTERACTION HANDLER (buttons + slash commands)
client.on("interactionCreate", async interaction => {

    // BUTTONS
    if (interaction.isButton()) {

        if (interaction.customId.startsWith("release_")) {
            return handleReleaseButtons(interaction);
        }

        if (interaction.customId.startsWith("buy_")) {
            return handleShopButtons(interaction);
        }

        if (interaction.customId.startsWith("battle_")) {
            return handleBattleButtons(interaction);
        }

        return;
    }

    // SLASH COMMANDS
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.run(interaction);
        } catch (err) {
            console.error(err);
            interaction.reply("There was an error running this command.");
        }
    }
});

// 6. START BOT
registerCommands();
client.login(process.env.TOKEN);
