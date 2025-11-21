function calculateItems(recipes, itemName, quantity, inventory, topLevel = true) {
    const recipe = recipes[itemName];
    const inputs = recipe.inputs;
    const batchSize = recipe.outputs[0].quantity;

    let inventoryQty = inventory[itemName] || 0;
    let batches = Math.max(0, Math.ceil(quantity / batchSize));
    let totalNeeded = batches * batchSize;

    let finalQty = Math.max(0, totalNeeded - inventoryQty);
    inventory[itemName] = Math.max(0, inventoryQty - totalNeeded);

    // Build result node (data only, no DOM)
    const node = {
        name: itemName,
        displayName: recipe.displayName,
        qty: finalQty,
        image: recipe.imageUrl,
        children: []
    };

    // Skip adding top-level node in UI but keep it in data
    if (!topLevel && finalQty <= 0) return null;

    // Recurse into inputs
    for (const input in inputs) {
        const inputQty = finalQty * inputs[input] / batchSize;
        const childNode = calculateItems(recipes, input, inputQty, inventory, false);
        if (childNode) node.children.push(childNode);
    }
    return node;
}

function calculate2(recipes, inventory) {
    const selected = document.getElementById('recipe').value;
    const quantity = parseInt(document.getElementById('quantity').value);

    if (!selected || !quantity || quantity < 1) {
        return { error: 'Invalid values' };
    }

    const inventoryCopy = JSON.parse(JSON.stringify(inventory));

    return calculateItems(recipes, selected, quantity, inventoryCopy, true);
}

export default calculate2;