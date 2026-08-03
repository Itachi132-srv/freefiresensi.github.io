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

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {  
        showPage("home");  
    }
});

const characters = {
    active: [
        {name: 'Alok', role: 'Support'}, {name: 'Tatsuya', role: 'Rusher'}, 
        {name: 'Chrono', role: 'Rifle'}, {name: 'Skyler', role: 'Rifle'}, 
        {name: 'Wukong', role: 'Rusher'}, {name: 'K', role: 'Support'}, 
        {name: 'Dimitri', role: 'Support'}, {name: 'Orion', role: 'Rusher'},
        {name: 'Homer', role: 'Rifle'}, {name: 'Iris', role: 'Sniper'},
        {name: 'Xayne', role: 'Rusher'}, {name: 'Steffie', role: 'Support'},
        {name: 'A124', role: 'Rifle'}, {name: 'Clu', role: 'Sniper'},
        {name: 'Santino', role: 'Rusher'}, {name: 'Ryden', role: 'Sniper'},
        {name: 'Ignis', role: 'Rifle'}, {name: 'Kairos', role: 'Rusher'},
        {name: 'Kassie', role: 'Support'}
    ],
    passive: [
        {name: 'Kelly', role: 'Rusher'}, {name: 'Hayato', role: 'Rusher'}, 
        {name: 'Jota', role: 'Rusher'}, {name: 'Miguel', role: 'Rifle'},
        {name: 'Moco', role: 'Sniper'}, {name: 'Maxim', role: 'Support'},
        {name: 'Kla', role: 'Rusher'}, {name: 'Luqueta', role: 'Rifle'},
        {name: 'Wolfrahh', role: 'Rifle'}, {name: 'D-Bee', role: 'Rusher'},
        {name: 'Leon', role: 'Support'}, {name: 'Otho', role: 'Rifle'},
        {name: 'Thiva', role: 'Support'}, {name: 'Shirou', role: 'Rusher'},
        {name: 'Maro', role: 'Sniper'}, {name: 'Nairi', role: 'Support'},
        {name: 'J.Biebs', role: 'Support'}, {name: 'Luna', role: 'Rusher'},
        {name: 'Sonia', role: 'Rusher'}, {name: 'Suzy', role: 'Rifle'},
        {name: 'Ford', role: 'Support'}, {name: 'Olivia', role: 'Support'},
        {name: 'Nikita', role: 'Rusher'}, {name: 'Andrew', role: 'Support'},
        {name: 'Antonio', role: 'Rusher'}, {name: 'Paloma', role: 'Support'},
        {name: 'Caroline', role: 'Rusher'}, {name: 'Misha', role: 'Rusher'},
        {name: 'Notora', role: 'Support'}, {name: 'Kapella', role: 'Support'},
        {name: 'Alvaro', role: 'Rifle'}, {name: 'Joseph', role: 'Rusher'},
        {name: 'Shani', role: 'Support'}, {name: 'Laura', role: 'Sniper'},
        {name: 'Rafael', role: 'Sniper'}, {name: 'Dasha', role: 'Rifle'},
        {name: 'Jai', role: 'Rusher'}
    ]
};

let selectedActive = null;
let selectedPassives = [];

function initGenerator() {
    const activeGrid = document.getElementById('active-grid');
    const passiveGrid = document.getElementById('passive-grid');

    characters.active.forEach(char => {
        const div = document.createElement('div');
        div.className = 'char-chip';
        div.innerText = char.name;
        div.onclick = () => toggleActive(char.name, div);
        activeGrid.appendChild(div);
    });

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

function startGeneration() {
    document.getElementById('selection-area').style.display = 'none';
    document.getElementById('loading-area').style.display = 'block';
    
    let progress = 0;
    const circle = document.getElementById('loading-circle');
    const text = document.getElementById('loading-text');
    const circumference = 283;

    const interval = setInterval(() => {
        progress += 2;
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
    
    let roleCounts = { 'Rusher': 0, 'Support': 0, 'Sniper': 0, 'Rifle': 0 };
    let fullObjects = [];

    allSelected.forEach(skillName => {
        let charObj = characters.active.find(c => c.name === skillName) || characters.passive.find(c => c.name === skillName);
        roleCounts[charObj.role]++;
        fullObjects.push(charObj);
    });

    let dominantRole = Object.keys(roleCounts).reduce((a, b) => roleCounts[a] > roleCounts[b] ? a : b);
    
    document.getElementById('result-role').innerText = `BEST FOR: ${dominantRole.toUpperCase()}`;
    
    const displayDiv = document.getElementById('selected-skills-display');
    displayDiv.innerHTML = '';
    allSelected.forEach(skill => {
        displayDiv.innerHTML += `<div class="result-skill">${skill}</div>`;
    });

    const suggestionDiv = document.getElementById('ai-suggestion');
    const mismatch = fullObjects.find(c => c.role !== dominantRole && c.name !== selectedActive);

    if (roleCounts[dominantRole] === 4) {
        suggestionDiv.innerHTML = `<p style="color: #00ff88;">Perfect Combination! All skills are excellent for a ${dominantRole} playstyle.</p>`;
    } else if (mismatch) {
        const alternative = characters.passive.find(c => c.role === dominantRole && !selectedPassives.includes(c.name));
        if (alternative) {
            suggestionDiv.innerHTML = `<p><strong>SDX TIP:</strong> This combo is decent, but <strong>${mismatch.name}</strong> leans more towards the ${mismatch.role} role. For a pure ${dominantRole} build, swapping it for <strong>${alternative.name}</strong> would be much better!</p>`;
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
    
    document.getElementById('loading-circle').style.strokeDashoffset = 283;
    document.getElementById('loading-text').innerText = '0%';
}

