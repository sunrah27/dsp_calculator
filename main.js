import calculate from './calculate.js';
import calculate2 from './calculate2.js';
import setViewMode, { setResult } from './render.js'
import { addToInventory, getInventory } from './inventory.js';

document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('recipes.json');
    const recipes = await response.json();

    const recipeSelect = document.getElementById('recipe');
    const addItemButton = document.getElementById('addItem');
    const calculateButton2 = document.getElementById('calculate2');
    const listButton = document.getElementById('list-button');
    const treeButton = document.getElementById('tree-button');

    // --- Custom dropdown state ---
    let currentTab = 'item'; // 'item' or 'building'
    let selectedValue = null;

    const trigger = document.getElementById('custom-select-trigger');
    const dropdown = document.getElementById('custom-select-dropdown');
    const list = document.getElementById('custom-select-list');
    const searchInput = document.getElementById('custom-select-search');
    const triggerIcon = document.getElementById('trigger-icon');
    const triggerLabel = document.getElementById('trigger-label');

    // Build sorted recipe entries by category
    const allRecipes = Object.keys(recipes)
        .filter(k => recipes[k].inputs)
        .sort((a, b) => recipes[a].displayName.localeCompare(recipes[b].displayName));

    function getFilteredRecipes(tab, query) {
        return allRecipes.filter(k => {
            const r = recipes[k];
            const matchesTab = r.category === tab;
            const matchesQuery = !query || r.displayName.toLowerCase().includes(query.toLowerCase());
            return matchesTab && matchesQuery;
        });
    }

    function renderList(tab, query) {
        list.innerHTML = '';
        const filtered = getFilteredRecipes(tab, query);

        if (filtered.length === 0) {
            list.innerHTML = '<div class="custom-select-empty">No results</div>';
            return;
        }

        filtered.forEach(k => {
            const r = recipes[k];
            const item = document.createElement('div');
            item.className = 'custom-select-item';
            if (k === selectedValue) item.classList.add('selected');
            item.dataset.value = k;

            const img = document.createElement('img');
            img.src = r.imageUrl;
            img.alt = r.displayName;
            img.className = 'select-item-icon';

            const span = document.createElement('span');
            span.textContent = r.displayName;

            item.appendChild(img);
            item.appendChild(span);
            item.addEventListener('click', () => selectItem(k));
            list.appendChild(item);
        });
    }

    function selectItem(key) {
        selectedValue = key;
        const r = recipes[key];

        // Update trigger display
        triggerIcon.src = r.imageUrl;
        triggerIcon.style.display = 'inline-block';
        triggerLabel.textContent = r.displayName;

        // Sync hidden select
        recipeSelect.value = key;

        closeDropdown();
        renderList(currentTab, searchInput.value);
    }

    function openDropdown() {
        dropdown.style.display = 'block';
        searchInput.value = '';
        renderList(currentTab, '');
        searchInput.focus();
    }

    function closeDropdown() {
        dropdown.style.display = 'none';
    }

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        if (dropdown.style.display === 'block') {
            closeDropdown();
        } else {
            openDropdown();
        }
    });

    searchInput.addEventListener('input', () => {
        renderList(currentTab, searchInput.value);
    });

    document.addEventListener('click', (e) => {
        if (!document.getElementById('custom-select').contains(e.target)) {
            closeDropdown();
        }
    });

    // --- Tabs ---
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTab = btn.dataset.tab;

            // Reset selection when switching tabs
            selectedValue = null;
            triggerIcon.style.display = 'none';
            triggerLabel.textContent = 'Select a recipe…';
            recipeSelect.value = '';

            if (dropdown.style.display === 'block') {
                searchInput.value = '';
                renderList(currentTab, '');
            }
        });
    });

    // Populate hidden select (for compatibility with existing calculate logic)
    allRecipes.forEach(k => {
        const opt = document.createElement('option');
        opt.value = k;
        opt.textContent = recipes[k].displayName;
        recipeSelect.appendChild(opt);
    });

    // Initial render
    triggerIcon.style.display = 'none';
    renderList(currentTab, '');

    // --- Existing event listeners ---
    addItemButton.addEventListener('click', () => {
        addToInventory(recipes);
    });

    calculateButton2.addEventListener('click', () => {
        const inventory = getInventory();
        const result = calculate2(recipes, inventory);
        setResult(result);
    });

    listButton.addEventListener('click', () => setViewMode(0));
    treeButton.addEventListener('click', () => setViewMode(1));
});
