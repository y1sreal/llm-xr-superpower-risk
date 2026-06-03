// Literature data is loaded from literature_data.js
// This file contains the interactive functionality

// DOM Elements
const searchBox = document.getElementById('searchBox');
const filterXRType = document.getElementById('filterXRType');
const filterSuperpower = document.getElementById('filterSuperpower');
const filterPopulation = document.getElementById('filterPopulation');
const resetButton = document.getElementById('resetFilters');
const literatureList = document.getElementById('literatureList');
const visibleCount = document.getElementById('visibleCount');

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Update total count
    const totalCountElement = document.getElementById('totalCount');
    if (totalCountElement) {
        totalCountElement.textContent = literatureData.length;
    }
    
    renderLiterature();
    setupEventListeners();
    
    // Smooth scroll for navigation
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
});

// Setup event listeners
function setupEventListeners() {
    searchBox.addEventListener('input', filterLiterature);
    filterXRType.addEventListener('change', filterLiterature);
    filterSuperpower.addEventListener('change', filterLiterature);
    filterPopulation.addEventListener('change', filterLiterature);
    resetButton.addEventListener('click', resetFilters);
}

// Render literature items
function renderLiterature() {
    literatureList.innerHTML = '';
    
    literatureData.forEach((paper, index) => {
        const paperElement = createPaperElement(paper, index);
        literatureList.appendChild(paperElement);
    });
    
    updateVisibleCount();
}

// Create paper element
function createPaperElement(paper, index) {
    const div = document.createElement('div');
    div.className = 'paper-item';
    div.dataset.index = index;
    
    // Determine superpower badge color
    let superpowerBadgeClass = 'superpower';
    if (paper.superpowerCategory.includes('internal')) {
        superpowerBadgeClass += ' internal';
    }
    if (paper.superpowerCategory.includes('external')) {
        superpowerBadgeClass += ' external';
    }
    if (paper.superpowerCategory.includes('readmind')) {
        superpowerBadgeClass += ' mindreading';
    }
    
    div.innerHTML = `
        <div class="paper-header">
            <div class="paper-title">${paper.title}</div>
            <div class="paper-authors">${paper.authors}</div>
        </div>
        
        <div class="paper-badges">
            <span class="badge xr-type">${paper.xrType}</span>
            <span class="badge ${superpowerBadgeClass}">${formatSuperpowerCategory(paper.superpowerCategory)}</span>
            ${paper.superpowerCodes ? `<span class="badge superpower">${paper.superpowerCodes}</span>` : ''}
            <span class="badge population">${paper.population}</span>
        </div>
        
        <div class="paper-description">
            <strong>Capability:</strong> ${paper.description}
        </div>
        
        ${paper.risks ? `
            <div class="paper-risks">
                <div class="paper-risks-title">Associated Risks</div>
                <div class="paper-risks-list">
                    <strong>Categories:</strong> ${paper.risks}<br>
                    <strong>Description:</strong> ${paper.riskDescription}
                </div>
            </div>
        ` : ''}
    `;
    
    return div;
}

// Format superpower category for display
function formatSuperpowerCategory(category) {
    const parts = category.split(',').map(s => s.trim());
    const formatted = parts.map(p => {
        if (p === 'internal') return 'Internal';
        if (p === 'external') return 'External';
        if (p === 'readmind') return 'Mind Reading';
        return p;
    });
    return formatted.join(' + ');
}

// Filter literature
function filterLiterature() {
    const searchTerm = searchBox.value.toLowerCase();
    const xrTypeFilter = filterXRType.value.toLowerCase();
    const superpowerFilter = filterSuperpower.value.toLowerCase();
    const populationFilter = filterPopulation.value.toLowerCase();
    
    const papers = document.querySelectorAll('.paper-item');
    
    papers.forEach(paper => {
        const index = parseInt(paper.dataset.index);
        const data = literatureData[index];
        
        // Search filter
        const matchesSearch = !searchTerm || 
            data.title.toLowerCase().includes(searchTerm) ||
            data.authors.toLowerCase().includes(searchTerm) ||
            data.description.toLowerCase().includes(searchTerm) ||
            data.risks.toLowerCase().includes(searchTerm);
        
        // XR type filter
        const matchesXRType = !xrTypeFilter || 
            data.xrType.toLowerCase().includes(xrTypeFilter);
        
        // Superpower filter
        const matchesSuperpower = !superpowerFilter || 
            data.superpowerCategory.toLowerCase().includes(superpowerFilter);
        
        // Population filter
        const matchesPopulation = !populationFilter || 
            data.population.toLowerCase() === populationFilter;
        
        // Show or hide paper
        if (matchesSearch && matchesXRType && matchesSuperpower && matchesPopulation) {
            paper.classList.remove('hidden');
        } else {
            paper.classList.add('hidden');
        }
    });
    
    updateVisibleCount();
}

// Reset filters
function resetFilters() {
    searchBox.value = '';
    filterXRType.value = '';
    filterSuperpower.value = '';
    filterPopulation.value = '';
    filterLiterature();
}

// Update visible count
function updateVisibleCount() {
    const visiblePapers = document.querySelectorAll('.paper-item:not(.hidden)');
    visibleCount.textContent = visiblePapers.length;
}

// Sticky navbar on scroll
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.pageYOffset > 0) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }
});

