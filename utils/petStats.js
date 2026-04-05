export function getPetStats(pet) {
    return {
        hp: 50 + pet.level * 10,
        attack: 5 + pet.level * 2,
        defense: 5 + pet.level * 2,
        speed: 5 + pet.level * 2
    };
}
