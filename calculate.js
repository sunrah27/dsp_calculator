// Function to calculate and display the required items
function calculateItems(recipes, itemName, quantity, resultsDiv, inventory, topLevel = true) {
    const recipe = recipes[itemName];
    const inputs = recipe.inputs;
    const batchSize = recipe.outputs[0].quantity; // Get the batch size from outputs

    // Adjust quantity based on inventory
    let inventoryQuantity = inventory[itemName] || 0;
    let adjustedQuantity = Math.max(0, Math.ceil(quantity / batchSize)); // Calculate batches needed
    let totalQuantity = adjustedQuantity * batchSize; // Total quantity required

    // Adjust inventory
    inventory[itemName] = Math.max(0, inventoryQuantity - totalQuantity);

    // Skip displaying the main recipe item if topLevel is true
    if (!topLevel) {
        console.log(`${recipe.displayName} ${totalQuantity}`);

        // Create a div for each result item
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');

        // Create image element
        const imageElement = document.createElement('img');
        imageElement.src = recipe.imageUrl;
        imageElement.alt = itemName;
        imageElement.classList.add('item-image');

        // Create a span for item name and quantity
        const itemQty = document.createElement('span');
        itemQty.classList.add('itemQty');
        itemQty.textContent = `${totalQuantity}`;
        
        const itemText = document.createElement('span');
        itemText.classList.add('itemText');
        itemText.textContent = `${recipe.displayName}`;

        resultItem.appendChild(imageElement);
        resultItem.appendChild(itemQty);
        resultItem.appendChild(itemText);

        // Append result item to resultsDiv
        resultsDiv.appendChild(resultItem);
    }

    // Recursively calculate inputs
    for (const inputItem in inputs) {
        if (inputs.hasOwnProperty(inputItem)) {
            const inputQuantity = inputs[inputItem];
            const totalInputQuantity = inputQuantity * adjustedQuantity;
            calculateItems(recipes, inputItem, totalInputQuantity, resultsDiv, inventory, false); // Pass false to skip topLevel item
        }
    }
}

// Main function to initiate calculation
function calculate(recipes, inventory) {
    // Get the select element where recipes will be displayed
    const recipeSelect = document.getElementById('recipe');
    const selectedRecipe = recipeSelect.value;

    // Get the quantity value
    const quantityInput = document.getElementById('quantity');
    const quantity = parseInt(quantityInput.value);

    console.log(`${recipes[selectedRecipe].displayName} ${quantity}`);

    // Get the result div
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results

    if (selectedRecipe && !isNaN(quantity) && quantity > 0) {
        // Create a copy of the inventory to avoid modifying the original inventory object
        const inventoryCopy = JSON.parse(JSON.stringify(inventory));

        // Initiate recursive calculation for the selected recipe
        calculateItems(recipes, selectedRecipe, quantity, resultsDiv, inventoryCopy);
    } else {
        resultsDiv.textContent = 'Please select a recipe and enter a valid quantity.';
    }
}

// Export the function
export default calculate;
