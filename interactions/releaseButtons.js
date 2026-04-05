import db from "../db.js";

export default async function handleReleaseButtons(interaction) {
    const user = db.ensureUser(interaction.user.id);

    // Cancel
    if (interaction.customId === "release_cancel") {
        return interaction.update({
            content: "Release cancelled.",
            components: []
        });
    }

    // Confirm
    if (interaction.customId.startsWith("release_confirm_")) {
        const number = parseInt(interaction.customId.split("_")[2]);

        if (number < 1 || number > user.pets.length) {
            return interaction.update({
                content: "That pet no longer exists.",
                components: []
            });
        }

        const pet = user.pets[number - 1];

        // Remove the pet
        user.pets.splice(number - 1, 1);

        // Fix activePet index
        if (user.activePet >= user.pets.length) {
            user.activePet = 0;
        }

        db.save();

        return interaction.update({
            content: `${pet.emoji} has been released.`,
            components: []
        });
    }
}
