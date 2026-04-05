import handleReleaseButtons from "./interactions/releaseButtons.js";

client.on("interactionCreate", async interaction => {

    // BUTTON HANDLER
    if (interaction.isButton()) {
        if (interaction.customId.startsWith("release_")) {
            return handleReleaseButtons(interaction);
        }
        return; // stop here for other buttons
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
