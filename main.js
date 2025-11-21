import calculate from './calculate.js';
import calculate2 from './calculate2.js';
import setViewMode, { setResult } from './render.js'
import { addToInventory, getInventory } from './inventory.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Fetch and parse the JSON file
    const response = await fetch('recipes.json');
    const recipes = await response.json();

    const recipeSelect = document.getElementById('recipe');
    const addItemButton = document.getElementById('addItem');
    const calculateButton = document.getElementById('calculate');
    const calculateButton2 = document.getElementById('calculate2');
    const listButton = document.getElementById('list-button');
    const treeButton = document.getElementById('tree-button');

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
    if (calculateButton !== null) {
        calculateButton.addEventListener('click', () => {
            const inventory = getInventory();
            calculate(recipes, inventory);
        });
    }

    // Event listener for the 'Calculate' button
    calculateButton2.addEventListener('click', () => {
        const inventory = getInventory();
        const result = calculate2(recipes, inventory);
        setResult(result);
    });

    // Eventi listner for the List and Tree buttons
    listButton.addEventListener('click', () => {
        setViewMode(0);
    });

    // Eventi listner for the List and Tree buttons
    treeButton.addEventListener('click', () => {
        setViewMode(1);
    });
});