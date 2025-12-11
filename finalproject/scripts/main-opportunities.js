// scripts/main-opportunities.js

import { fetchOpportunities } from './data.js';
import { savePreferences, getPreferences } from './storage.js';
import { openModal } from './modal.js';
import { renderSkeletons, renderNoResults, makeOpportunityCard } from './render.js';

// JSON path inside /data folder
const OPPS_PATH = './data/opportunities.json';
const PER_PAGE = 12;

const elements = {
  grid: document.getElementById('opportunities-grid'),
  resultsText: document.getElementById('results-text'),
  filtersForm: document.getElementById('opportunity-filters'),
  loadMoreContainer: document.getElementById('load-more-container'),
  loadMoreBtn: document.getElementById('load-more-btn'),
  noResults: document.getElementById('no-results'),
  searchInput: document.getElementById('search'),
  typeSelect: document.getElementById('type'),
  locationSelect: document.getElementById('location'),
  categorySelect: document.getElementById('category')
};

let allData = [];
let filteredData = [];
let currentPage = 1;

// Persisted state key
const PREF_KEY = 'filters';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);

async function init() {
  // Show skeleton cards while loading
  renderSkeletons(elements.grid, 6);

  // Restore saved filters
  const savedFilters = getPreferences(PREF_KEY, {});
  if (savedFilters) restoreFilterUI(savedFilters);

  // Merge with URL query params
  const urlParams = new URLSearchParams(window.location.search);
  const incomingFilters = {};
  ['search', 'type', 'location', 'category'].forEach(key => {
    if (urlParams.has(key)) incomingFilters[key] = decodeURIComponent(urlParams.get(key));
  });
  if (Object.keys(incomingFilters).length) {
    applyFilterValuesToUI(incomingFilters);
    savePreferences(PREF_KEY, incomingFilters);
  }

  // Fetch opportunities
  allData = await fetchOpportunities(OPPS_PATH);

  // Apply filters and render first page
  applyFiltersAndRender();

  // Attach event listeners
  attachEvents();

  // Initialize Splide slider for company showcase
  const slider = document.getElementById('company-slider');
  if (slider) {
    new Splide('#company-slider', {
      type: 'loop',
      perPage: 4,
      autoplay: true,
      gap: '1rem',
      breakpoints: {
        1024: { perPage: 3 },
        768: { perPage: 2 },
        480: { perPage: 1 }
      }
    }).mount();
  }
}

function attachEvents() {
  // Filters: input and change
  if (elements.filtersForm) {
    elements.filtersForm.addEventListener('input', debounce(handleFiltersChange, 250));
    elements.filtersForm.addEventListener('change', handleFiltersChange);
  }

  // Load more
  if (elements.loadMoreBtn) {
    elements.loadMoreBtn.addEventListener('click', () => {
      currentPage++;
      renderCurrentPage();
    });
  }

  // Delegate "View Details" clicks to open modal
  if (elements.grid) {
    elements.grid.addEventListener('click', (e) => {
      const btn = e.target.closest('.view-details');
      if (!btn) return;
      const id = btn.dataset.id;
      const item = allData.find(x => x.id === id);
      if (item) {
        openModal({
          title: `${item.title} — ${item.company}`,
          html: `
            <p><strong>Location:</strong> ${escapeHTML(item.location)}</p>
            <p><strong>Type:</strong> ${escapeHTML(item.type)} • <strong>Category:</strong> ${escapeHTML(item.category)}</p>
            <p><strong>Salary:</strong> ${escapeHTML(item.salary)}</p>
            <hr/>
            <p>${escapeHTML(item.description)}</p>
            <p style="margin-top:1rem;"><a class="btn btn-primary" href="${escapeHTML(item.apply_url)}" target="_blank" rel="noopener">Apply Now</a></p>
          `
        });
      }
    });
  }

  // Clear all filters global function
  window.clearAllFilters = () => {
    if (elements.searchInput) elements.searchInput.value = '';
    if (elements.typeSelect) elements.typeSelect.value = '';
    if (elements.locationSelect) elements.locationSelect.value = '';
    if (elements.categorySelect) elements.categorySelect.value = '';
    handleFiltersChange();
  };

  // Navbar toggle
  const navbarToggle = document.querySelector('.navbar-toggle');
  if (navbarToggle) {
    navbarToggle.addEventListener('click', () => {
      const nav = document.querySelector('.navbar-nav');
      if (nav) nav.classList.toggle('active');
      navbarToggle.classList.toggle('active'); // optional: animate toggle button
    });
  }
}

// Process filter changes
function handleFiltersChange() {
  const filterValues = getFilterValues();
  savePreferences(PREF_KEY, filterValues);
  currentPage = 1;
  applyFiltersAndRender();
}

// Apply filters and render data
function applyFiltersAndRender() {
  const filters = getFilterValues();
  filteredData = allData
    .filter(item => {
      const q = (filters.search || '').toLowerCase().trim();
      if (q) {
        const hay = `${item.title} ${item.company} ${item.description} ${item.category}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filters.type && item.type !== filters.type) return false;
      if (filters.location && item.location !== filters.location) return false;
      if (filters.category && item.category !== filters.category) return false;
      return true;
    })
    .sort((a, b) => new Date(b.date_posted) - new Date(a.date_posted));

  // Update results count safely
  if (elements.resultsText) {
    elements.resultsText.textContent = `${filteredData.length} opportunity${filteredData.length === 1 ? '' : 'ies'} found`;
  }

  // Handle no results
  if (filteredData.length === 0) {
    if (elements.noResults) elements.noResults.style.display = 'block';
    if (elements.loadMoreContainer) elements.loadMoreContainer.style.display = 'none';
    renderNoResults(elements.grid);
    return;
  } else {
    if (elements.noResults) elements.noResults.style.display = 'none';
  }

  currentPage = Math.max(1, currentPage);
  renderCurrentPage();
}

// Render current page
function renderCurrentPage() {
  const start = (currentPage - 1) * PER_PAGE;
  const end = start + PER_PAGE;
  const pageItems = filteredData.slice(0, end);

  const html = pageItems.map(item => makeOpportunityCard(item)).join('');
  if (elements.grid) elements.grid.innerHTML = html;

  // Show/hide load more button
  if (elements.loadMoreContainer) {
    elements.loadMoreContainer.style.display = filteredData.length > end ? 'block' : 'none';
  }
}

// Get current filter values
function getFilterValues() {
  return {
    search: elements.searchInput?.value.trim() || '',
    type: elements.typeSelect?.value || '',
    location: elements.locationSelect?.value || '',
    category: elements.categorySelect?.value || ''
  };
}

// Restore saved filter values in UI
function restoreFilterUI(saved = {}) {
  if (elements.searchInput && saved.search) elements.searchInput.value = saved.search;
  if (elements.typeSelect && saved.type) elements.typeSelect.value = saved.type;
  if (elements.locationSelect && saved.location) elements.locationSelect.value = saved.location;
  if (elements.categorySelect && saved.category) elements.categorySelect.value = saved.category;
}

// Apply incoming URL filters to UI
function applyFilterValuesToUI(incoming = {}) {
  if (elements.searchInput && incoming.search) elements.searchInput.value = incoming.search;
  if (elements.typeSelect && incoming.type) elements.typeSelect.value = incoming.type;
  if (elements.locationSelect && incoming.location) elements.locationSelect.value = incoming.location;
  if (elements.categorySelect && incoming.category) elements.categorySelect.value = incoming.category;
}

// Simple debounce utility
function debounce(fn, wait = 200) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), wait);
  };
}

// Animate statistics numbers
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = +stat.dataset.target; // get the target number
        let count = 0;
        const increment = Math.ceil(target / 200); // adjust speed

        const update = () => {
            count += increment;
            if (count > target) count = target;
            stat.textContent = count;
            if (count < target) {
                requestAnimationFrame(update); // smooth animation
            }
        };

        update();
    });
}

// For Lastmodified date
const lastModifiedElement = document.getElementById("lastmodified");

    if (lastModifiedElement) {
        const modifiedDate = new Date(document.lastModified);
        const formattedDate = modifiedDate.toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

        lastModifiedElement.textContent = "Last Updated: " + formattedDate;
    }

// Run animation when DOM is ready
document.addEventListener('DOMContentLoaded', animateStats);

// Escape HTML safely
function escapeHTML(str = '') {
  return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
}
