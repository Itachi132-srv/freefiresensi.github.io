// ==============================
// SHARDEX FF SKILLS
// Premium Navigation & Generator
// ==============================

const pages = document.querySelectorAll(".page");

function showPage(pageId) {
    pages.forEach(page => {
        page.classList.remove("active");
    });
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
}
window.showPage = showPage;

document.addEventListener("DOMContentLoaded", () => {
    showPage("home");
    initGenerator();
});

// Optional: Keyboard shortcuts
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {  
        showPage("home");  
    }
});

// ==============================
// GENERATOR LOGIC
// ==============================

// Characters data with their primary roles
const characters = {
    active: [
        {name: 'Tatsuya', role: 'Rusher'}, {name: 'Alok', role: 'Support'}, 
        {name: 'Skyler', role: 'Rifle'}, {name: 'Iris', role: 'Sniper'}, 
        {name: 'Dimitri', role: 'Support'}, {name: 'Orion', role: 'Rusher'}
    ],
    passive: [
        {name: 'Jota', role: 'Rusher'}, {name: 'Hayato', role: 'Rusher'}, 
        {name: 'D-Bee', role: 'Rusher'}, {name: 'Kelly', role: 'Rusher'},
        {name: 'Kapella', role: 'Support'}, {name: 'Olivia', role: 'Support'}, 
        {name: 'Leon', role: 'Support'}, {name: 'Shirou', role: 'Rifle'},
        {name: 'Laura', role: 'Sniper'}, {name: 'Moco', role: 'Sniper'}, 
        {name: 'Rafael', role: 'Sniper'}, {name: 'Wolfrahh', role: 'Rifle'}
    ]
};

let selectedActive = null;
let selectedPassives = [];

function initGenerator() {
    const activeGrid = document.getElementById('active-grid');
    const passiveGrid = document.getElementById('passive-grid');

    // Render Actives
    characters.active.forEach(char => {
        const div = document.createElement('div');
        div.className = 'char-chip';
        div.innerText = char.name;
        div.onclick = () => toggleActive(char.name, div);
        activeGrid.appendChild(div);
    });

    // Render Passives
    characters.passive.forEach(char => {
        const div = document.createElement('div');
        div.className = 'char-chip passive-chip';
        div.innerText = char.name;
        div.onclick = () => togglePassive(char.name, div);
        passiveGrid.appendChild(div);
    });
}

function toggleActive(name, element) {
    const activeChips = document.getElementById('active-grid').children;
    for(let chip of activeChips) {
        chip.classList.remove('selected');
    }
    element.classList.add('selected');
    selectedActive = name;
    checkGenerateBtn();
}

function togglePassive(name, element) {
    if (selectedPassives.includes(name)) {
        selectedPassives = selectedPassives.filter(p => p !== name);
        element.classList.remove('selected');
    } else {
        if (selectedPassives.length < 3) {
            selectedPassives.push(name);
            element.classList.add('selected');
        }
    }
    
    document.getElementById('passive-count').innerText = `(${selectedPassives.length}/3)`;
    
    // Disable remaining if 3 selected
    const allPassiveChips = document.querySelectorAll('.passive-chip');
    allPassiveChips.forEach(chip => {
        if (!chip.classList.contains('selected') && selectedPassives.length >= 3) {
            chip.classList.add('disabled');
        } else {
            chip.classList.remove('disabled');
        }
    });

    checkGenerateBtn();
}

function checkGenerateBtn() {
    const btn = document.getElementById('generate-btn');
    if (selectedActive && selectedPassives.length === 3) {
        btn.style.display = 'inline-block';
    } else {
        btn.style.display = 'none';
    }
}

// ==============================
// LOADING & EVALUATION
// ==============================

function startGeneration() {
    document.getElementById('selection-area').style.display = 'none';
    document.getElementById('loading-area').style.display = 'block';
    
    let progress = 0;
    const circle = document.getElementById('loading-circle');
    const text = document.getElementById('loading-text');
    const circumference = 283;

    const interval = setInterval(() => {
        progress += 2; // Speed of loading
        text.innerText = progress + '%';
        
        const offset = circumference - (progress / 100) * circumference;
        circle.style.strokeDashoffset = offset;

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(showResults, 500);
        }
    }, 40);
}

function showResults() {
    document.getElementById('loading-area').style.display = 'none';
    document.getElementById('result-area').style.display = 'block';

    const allSelected = [selectedActive, ...selectedPassives];
    
    // Find roles for selected skills
    let roleCounts = { 'Rusher': 0, 'Support': 0, 'Sniper': 0, 'Rifle': 0 };
    let fullObjects = [];

    allSelected.forEach(skillName => {
        let charObj = characters.active.find(c => c.name === skillName) || characters.passive.find(c => c.name === skillName);
        roleCounts[charObj.role]++;
        fullObjects.push(charObj);
    });

    // Determine dominant role
    let dominantRole = Object.keys(roleCounts).reduce((a, b) => roleCounts[a] > roleCounts[b] ? a : b);
    
    document.getElementById('result-role').innerText = `🔥 BEST FOR: ${dominantRole.toUpperCase()} 🔥`;
    
    // Display selected skills
    const displayDiv = document.getElementById('selected-skills-display');
    displayDiv.innerHTML = '';
    allSelected.forEach(skill => {
        displayDiv.innerHTML += `<div class="result-skill">${skill}</div>`;
    });

    // AI Suggestion Logic
    const suggestionDiv = document.getElementById('ai-suggestion');
    const mismatch = fullObjects.find(c => c.role !== dominantRole && c.name !== selectedActive); // Find a passive that doesn't fit

    if (roleCounts[dominantRole] === 4) {
        suggestionDiv.innerHTML = `<p style="color: #00ff88;">Perfect Combination! Saari skills ${dominantRole} playstyle ke liye behtareen hain.</p>`;
    } else if (mismatch) {
        // Find a better alternative
        const alternative = characters.passive.find(c => c.role === dominantRole && !selectedPassives.includes(c.name));
        if (alternative) {
            suggestionDiv.innerHTML = `<p><strong>AI Tip:</strong> Ye combo theek hai, lekin <strong>${mismatch.name}</strong> ${mismatch.role} ke liye hai. Ek pure ${dominantRole} build ke liye aap iski jagah <strong>${alternative.name}</strong> use karen to zyada acha hai!</p>`;
        } else {
             suggestionDiv.innerHTML = `<p>Good mixed combination for versatile gameplay!</p>`;
        }
    }
}

function resetGenerator() {
    selectedActive = null;
    selectedPassives = [];
    document.getElementById('passive-count').innerText = `(0/3)`;
    
    const chips = document.querySelectorAll('.char-chip');
    chips.forEach(chip => {
        chip.classList.remove('selected');
        chip.classList.remove('disabled');
    });

    document.getElementById('generate-btn').style.display = 'none';
    document.getElementById('result-area').style.display = 'none';
    document.getElementById('selection-area').style.display = 'block';
    
    // Reset Loading circle
    document.getElementById('loading-circle').style.strokeDashoffset = 283;
    document.getElementById('loading-text').innerText = '0%';
}
