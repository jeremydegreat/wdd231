// discover.js (module)
import { places } from '../data/places.mjs';

const grid = document.getElementById('discover-grid');
const visitMsg = document.getElementById('visit-message');
const STORAGE_KEY = 'awka_discover_last_visit';

// Render cards
function createCard(place) {
  const card = document.createElement('article');
  card.className = 'card';
  card.setAttribute('role', 'listitem');
  card.innerHTML = `
    <h2 class="card-title">${escapeHtml(place.title)}</h2>
    <figure class="card-figure" aria-hidden="false">
      <img src="${escapeHtml(place.image)}" alt="${escapeHtml(place.title)} photo" width="300" height="200" loading="lazy">
    </figure>
    <address class="card-address">${escapeHtml(place.address)}</address>
    <p class="card-desc">${escapeHtml(place.description)}</p>
    <div class="card-actions">
      <button class="learn-btn" data-id="${escapeHtml(place.id)}">Learn more</button>
    </div>
  `;
  return card;
}

const lastModified = document.querySelector('#lastmodified');
 // Last modified
    if (lastModified) {
        lastModified.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" style="margin-right:8px; vertical-align:middle;">
                <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm1 11h4v2h-6V7h2v6z"></path>
            </svg>
            Last modified: ${document.lastModified}
        `;
    }

// Hamburger Toggle
const hamburger = document.querySelector('.hamburger');
const navlinks = document.querySelector('.navlinks');

hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    navlinks.classList.toggle('active');
    hamburger.classList.toggle('active');  /* animate hamburger icon */
});

// Close navlinks when clicking anywhere else on the document
document.addEventListener('click', (e) => {
    if (navlinks.classList.contains('active') && 
        !hamburger.contains(e.target) && 
        !navlinks.contains(e.target)) {
        navlinks.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Close navlinks when clicking a nav link
const navItems = document.querySelectorAll('.navlinks li a');
navItems.forEach((item) => {
    item.addEventListener('click', () => {
        navlinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// CHANGE OD COLOR ON-SCROLL
window.addEventListener("scroll", function () {
    const header = document.querySelector(".header");

    if (window.scrollY > 10) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

// Basic HTML escape
function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]; });
}

function render() {
  const fragment = document.createDocumentFragment();
  places.forEach(p => fragment.appendChild(createCard(p)));
  grid.appendChild(fragment);
}

// localStorage visit logic
function showVisitMessage() {
  const last = localStorage.getItem(STORAGE_KEY);
  const now = Date.now();

  if (!last) {
    visitMsg.textContent = 'Welcome! Let us know if you have any questions.';
  } else {
    const lastMs = parseInt(last, 10);
    const diffMs = now - lastMs;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays < 1) {
      visitMsg.textContent = 'Back so soon! Awesome!';
    } else {
      visitMsg.textContent = `You last visited ${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago.`;
    }
  }

  // store current visit
  localStorage.setItem(STORAGE_KEY, String(now));
}

// Optional: basic "learn more" placeholder (you can expand to modal or separate page)
function wireButtons() {
  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('.learn-btn');
    if (!btn) return;
    const id = btn.dataset.id;
    const place = places.find(p => p.id === id);
    if (place) {
      // Simple details overlay — replace with modal/page as needed
      alert(`${place.title}\n\n${place.address}\n\n${place.description}`);
    }
  });
}

// Run
render();
showVisitMessage();
wireButtons();
