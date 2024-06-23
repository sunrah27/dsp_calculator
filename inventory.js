function addToInventory(recipes) {
    console.log('Add Item button clicked');
    const inventoryDiv = document.getElementById('inventory');

    const itemSelect = document.createElement('select');

    const sortedRecipes = Object.keys(recipes).sort((a, b) => recipes[a].displayName.localeCompare(recipes[b].displayName));
    sortedRecipes.forEach(recipe => {
        itemSelect.innerHTML += `<option value="${recipe}">${recipes[recipe].displayName}</option>`;
    });

    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.min = '0';
    quantityInput.value = '0';

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => {
        itemDiv.remove(); // Remove the entire itemDiv when Remove button is clicked
    });

    const itemDiv = document.createElement('div');
    itemDiv.classList.add('inventory-item');
    itemDiv.appendChild(itemSelect); // Add select element to itemDiv
    itemDiv.appendChild(quantityInput); // Add input element to itemDiv
    itemDiv.appendChild(removeButton); // Add remove button to itemDiv
    inventoryDiv.appendChild(itemDiv);
};

// Function to gather inventory data
function getInventory() {
    const inventory = {};
    const inventoryItems = document.querySelectorAll('.inventory-item');

    inventoryItems.forEach(itemDiv => {
        const itemSelect = itemDiv.querySelector('select');
        const quantityInput = itemDiv.querySelector('input');
        const itemName = itemSelect.value;
        const quantity = parseInt(quantityInput.value);
        if (itemName && !isNaN(quantity) && quantity > 0) {
            inventory[itemName] = (inventory[itemName] || 0) + quantity;
        }
    });

    return inventory;
}

export { addToInventory, getInventory };