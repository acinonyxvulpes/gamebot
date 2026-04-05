import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

// Import button handlers
import handleReleaseButtons from "./interactions/releaseButtons.js";
import handleShopButtons from "./interactions/shopButtons.js";

client.on("interactionCreate", async interaction => {

    if (interaction.isButton()) {
        if (interaction.customId.startsWith("release_")) {
            return handleReleaseButtons(interaction);
        }
        if (interaction.customId.startsWith("buy_")) {
            return handleShopButtons(interaction);
        }
        return;
    }

    // slash commands...
});


// Create Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Load commands from /commands folder
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

// Register slash commands with Discord
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

// Bot ready event
client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// Handle ALL interactions (buttons + slash commands)
client.on("interactionCreate", async interaction => {

    // BUTTON HANDLER
    if (interaction.isButton()) {
        if (interaction.customId.startsWith("release_")) {
            return handleReleaseButtons(interaction);
        }
        return;
    }

    // SLASH COMMAND HANDLER
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

// Start bot
registerCommands();
client.login(process.env.TOKEN);

