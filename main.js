import calculate from './calculate.js';
import { addToInventory, getInventory } from './inventory.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Fetch and parse the JSON file
    const response = await fetch('recipes.json');
    const recipes = await response.json();

    const recipeSelect = document.getElementById('recipe');
    const inventoryDiv = document.getElementById('inventory');
    const addItemButton = document.getElementById('addItem');
    const calculateButton = document.getElementById('calculate');

    // Populate recipe dropdown sorted alphabetically
    const sortedRecipes = Object.keys(recipes).sort((a, b) => recipes[a].displayName.localeCompare(recipes[b].displayName));

    sortedRecipes.forEach(recipe => {
        if (recipes[recipe].inputs) {
            recipeSelect.innerHTML += `<option value="${recipe}">${recipes[recipe].displayName}</option>`;
        }
    });

    // Event listener for the 'Add items' button
    addItemButton.addEventListener('click', () => {
        addToInventory(recipes);
    });

    // Event listener for the 'Calculate' button
    calculateButton.addEventListener('click', () => {
        const inventory = getInventory();
        calculate(recipes, inventory);
    });
});