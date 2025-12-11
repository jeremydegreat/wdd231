// ==========================
// Opportunities Page - CSP-safe
// ==========================
const opportunitiesPageContainer = document.querySelector('.opportunities-grid');
const filterForm = document.querySelector('.filter-form');
let opportunities = [];
let filteredOpportunities = [];
let currentPage = 1;
const itemsPerPage = 3;

// Apply filters
if (filterForm) {
    const filters = { type: '', location: '', category: '', search: '' };

    // Initialize form values
    Object.keys(filters).forEach(key => {
        const input = filterForm.querySelector(`[name="${key}"]`);
        if (input && filters[key]) input.value = filters[key];
        if (input) {
            input.addEventListener('input', () => {
                filters[key] = input.value.toLowerCase();
                currentPage = 1;
                applyFilters();
            });
        }
    });
}

function applyFilters() {
    filteredOpportunities = allOpportunities.filter(opp => {
        if (filters.type && opp.type.toLowerCase() !== filters.type) return false;
        if (filters.category && opp.category && opp.category.toLowerCase() !== filters.category) return false;
        if (filters.location && !opp.location.toLowerCase().includes(filters.location)) return false;
        if (filters.search) {
            const text = `${opp.title} ${opp.company} ${opp.description}`.toLowerCase();
            if (!text.includes(filters.search)) return false;
        }
        return true;
    });
    renderOpportunitiesPage();
}

// Render with pagination
function renderOpportunitiesPage() {
    if (!opportunitiesPageContainer) return;

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = filteredOpportunities.slice(start, end);

    if (!pageItems.length) {
        opportunitiesPageContainer.innerHTML = `<p>No opportunities found.</p>`;
        return;
    }

    opportunitiesPageContainer.innerHTML = pageItems.map(op => `
        <div class="card" data-id="${op.id}">
            <div class="card-content">
                <h3 class="card-title">${op.title}</h3>
                <p class="card-subtitle">${op.company}</p>
                <div class="card-meta"><span>📍 ${op.location}</span> <span>💰 ${op.salary ? '₦' + op.salary.toLocaleString() : 'Negotiable'}</span></div>
                <p class="card-description">${op.description}</p>
                <div class="card-footer"><span class="card-badge ${op.type.toLowerCase()}">${op.type}</span></div>
            </div>
        </div>
    `).join('');

    // Card click modal
    opportunitiesPageContainer.querySelectorAll('.card').forEach((card, idx) => {
        card.addEventListener('click', () => {
            const opp = pageItems[idx];
            alert(`Opportunity Details:\nTitle: ${opp.title}\nCompany: ${opp.company}\nLocation: ${opp.location}\nSalary: ${opp.salary ? '₦' + opp.salary.toLocaleString() : 'Negotiable'}\nDescription: ${opp.description}`);
        });
    });

    renderPagination();
}

// Pagination controls
function renderPagination() {
    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) return;

    const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage);
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = i === currentPage ? 'active' : '';
        btn.addEventListener('click', () => {
            currentPage = i;
            renderOpportunitiesPage();
        });
        paginationContainer.appendChild(btn);
    }
}

// Initial render
renderOpportunitiesPage();
