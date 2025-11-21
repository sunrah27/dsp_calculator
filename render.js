let viewMode = 0; // 0 = list, 1 = tree
let lastResult = null; // stores result from calculate2

export default function setViewMode(num) {
    viewMode = num;
    renderResults();
}

export function setResult(data) {
    lastResult = data;
    renderResults();
}

function renderResults() {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    // nothing calculated yet
    if (!lastResult || lastResult.error) return;

    if (viewMode === 0) {
        renderList(lastResult, resultsDiv);
    } else {
        renderTree(lastResult, resultsDiv);
    }
}

function renderList(data, resultsDiv) {
    resultsDiv.innerHTML = '';

    function flatten(node, arr) {
        if (node.qty > 0) arr.push(node);
        node.children.forEach(child => flatten(child, arr));
        return arr;
    }

    const list = flatten(data, []);

    list.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('result-item');

        div.innerHTML = `
            <img src="${item.image}">
            <span>${item.qty}</span>
        `;

        resultsDiv.appendChild(div);
    });
}

function renderTree(rootNode, container) {
    console.log(`renderTree has been triggered`);
    const wrapper = document.createElement("ul");
    wrapper.className = "tree";
    wrapper.appendChild(renderNode(rootNode));
    container.appendChild(wrapper);
}

function renderNode(node) {
    const li = document.createElement("li");

    const row = document.createElement("div");
    row.className = "node";

    // toggle button
    toggle.className = "toggle";
    const hasChildren = node.children && node.children.length > 0;
    toggle.textContent = hasChildren ? "−" : "·";
    toggle.disabled = !hasChildren;

    // icon
    const img = document.createElement("img");
    img.className = "icon";
    if (node.image) img.src = node.image;

    // name
    const nameSpan = document.createElement("span");
    nameSpan.textContent = node.displayName;

    // qty
    const qtySpan = document.createElement("span");
    qtySpan.className = "qty";
    qtySpan.textContent = "x" + node.qty;

    row.append(toggle, img, nameSpan, qtySpan);
    li.appendChild(row);

    // children UL
    if (hasChildren) {
        const ul = document.createElement("ul");
        node.children.forEach(child => ul.appendChild(renderNode(child)));
        li.appendChild(ul);

        toggle.addEventListener("click", () => {
            li.classList.toggle("collapsed");
            toggle.textContent = li.classList.contains("collapsed") ? "+" : "−";
        });
    }

    return li;
}