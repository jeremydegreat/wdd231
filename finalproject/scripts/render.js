// scripts/render.js

export function renderSkeletons(container, count = 6) {
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    container.innerHTML += `
      <div class="opportunity-card skeleton">
        <div class="skeleton-title"></div>
        <div class="skeleton-text"></div>
        <div class="skeleton-text"></div>
      </div>
    `;
  }
}

export function renderNoResults(container) {
  if (!container) return;
  container.innerHTML = '<p class="no-results-text">No opportunities found.</p>';
}

export function makeOpportunityCard(item) {
  return `
    <div class="opportunity-card">
      <h3 class="opp-title">${escapeHTML(item.title)}</h3>
      <div class="opp-meta">
        <p class="opp-company"><strong>Company:</strong> <span>${escapeHTML(item.company)}</span></p>
        <p class="opp-location"><strong>Location:</strong> <span>${escapeHTML(item.location)}</span></p>
        <p class="opp-type-category">
          <strong>Type:</strong> <span>${escapeHTML(item.type)}</span> 
          <span class="divider">•</span> 
          <strong>Category:</strong> <span>${escapeHTML(item.category)}</span>
        </p>
      </div>
      <button class="view-details" data-id="${item.id}" aria-label="View details for ${escapeHTML(item.title)}">View Details</button>
    </div>
  `;
}

// Safe escape for card text
function escapeHTML(s = '') {
  return String(s).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
}
