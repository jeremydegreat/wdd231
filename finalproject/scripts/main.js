// Initialize company slider
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('company-slider')) {
        new Splide('#company-slider', {
            type: 'loop',
            autoplay: true,
            interval: 3000,
            perPage: 4,
            perMove: 1,
            gap: '2rem',
            arrows: false,
            pagination: false,
            breakpoints: {
                768: {
                    perPage: 2,
                },
                480: {
                    perPage: 1,
                }
            }
        }).mount();
    }
});

// Newsletter form handling
document.getElementById('newsletter-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[name="email"]').value;
    
    // Simulate newsletter subscription
    const button = this.querySelector('button');
    const originalText = button.textContent;
    button.textContent = 'Subscribing...';
    button.disabled = true;
    
    setTimeout(() => {
        alert(`Thank you for subscribing! We'll send opportunities to ${email}`);
        this.reset();
        button.textContent = originalText;
        button.disabled = false;
    }, 1000);
});


// Anambra Jobs & Skills Hub - Main JavaScript Module
// Import ES modules
import { fetchOpportunities } from './js/api.js';
import { storage } from './js/storage.js';
import { modal } from './js/modal.js';
import { utils } from './js/utils.js';

// Global state
let opportunities = [];
let filteredOpportunities = [];
let currentPage = 'index';

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Determine current page
    currentPage = getCurrentPage();
    
    // Initialize common functionality
    initializeNavigation();
    initializeScrollAnimations();
    
    // Initialize page-specific functionality
    switch(currentPage) {
        case 'index':
            initializeHomePage();
            break;
        case 'opportunities':
            initializeOpportunitiesPage();
            break;
        case 'resources':
            initializeResourcesPage();
            break;
    }
    
    // Initialize forms
    initializeForms();
}

function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('opportunities.html')) return 'opportunities';
    if (path.includes('resources.html')) return 'resources';
    return 'index';
}

// Navigation functionality
function initializeNavigation() {
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarNav = document.querySelector('.navbar-nav');
    const navLinks = document.querySelectorAll('.navbar-nav a');
    
    // Mobile menu toggle
    if (navbarToggle) {
        navbarToggle.addEventListener('click', function() {
            navbarNav.classList.toggle('active');
        });
    }
    
    // Active state management
    navLinks.forEach(link => {
        if (link.getAttribute('href') === window.location.pathname.split('/').pop()) {
            link.classList.add('active');
        }
        
        // Close mobile menu on link click
        link.addEventListener('click', function() {
            navbarNav.classList.remove('active');
        });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.card, .stat-item, .section-header').forEach(el => {
        observer.observe(el);
    });
}

// Home page functionality
function initializeHomePage() {
    initializeHeroAnimations();
    initializeStatsCounters();
    initializeLatestOpportunities();
}

function initializeHeroAnimations() {
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        // Typewriter effect for hero title
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 500);
    }
}

function initializeStatsCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element, target) => {
        let current = 0;
        const increment = target / 100;
        const duration = 2000;
        const stepTime = duration / 100;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format number with appropriate suffix
            let displayValue = Math.floor(current);
            if (target >= 1000) {
                displayValue = (displayValue / 1000).toFixed(1) + 'K';
            }
            
            element.textContent = displayValue;
        }, stepTime);
    };
    
    // Trigger counter animation when stats section is visible
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    statNumbers.forEach(stat => {
                        const target = parseInt(stat.dataset.target);
                        if (target) {
                            animateCounter(stat, target);
                        }
                    });
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(statsSection);
    }
}

async function initializeLatestOpportunities() {
    try {
        opportunities = await fetchOpportunities();
        const latestOpportunities = opportunities.slice(0, 3);
        
        const container = document.querySelector('.latest-opportunities');
        if (container) {
            container.innerHTML = latestOpportunities.map(opp => 
                createOpportunityCard(opp)
            ).join('');
            
            // Add click handlers for cards
            container.querySelectorAll('.card').forEach((card, index) => {
                card.addEventListener('click', () => {
                    modal.show(latestOpportunities[index]);
                });
            });
        }
    } catch (error) {
        console.error('Failed to load latest opportunities:', error);
    }
}

// Opportunities page functionality
async function initializeOpportunitiesPage() {
    try {
        opportunities = await fetchOpportunities();
        filteredOpportunities = [...opportunities];
        
        initializeFilters();
        renderOpportunities();
        
    } catch (error) {
        console.error('Failed to load opportunities:', error);
        showErrorMessage('Failed to load opportunities. Please try again later.');
    }
}

function initializeFilters() {
    const filterForm = document.querySelector('.filter-form');
    if (!filterForm) return;
    
    const filters = {
        type: '',
        location: '',
        category: ''
    };
    
    // Load saved filters from storage
    const savedFilters = storage.get('filters');
    if (savedFilters) {
        Object.assign(filters, savedFilters);
        
        // Set form values
        Object.keys(filters).forEach(key => {
            const input = filterForm.querySelector(`[name="${key}"]`);
            if (input && filters[key]) {
                input.value = filters[key];
            }
        });
    }
    
    // Handle filter changes
    filterForm.addEventListener('change', function(e) {
        const { name, value } = e.target;
        filters[name] = value;
        
        // Save filters to storage
        storage.set('filters', filters);
        
        // Apply filters
        applyFilters(filters);
    });
    
    // Handle search input
    const searchInput = filterForm.querySelector('input[name="search"]');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function(e) {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                filters.search = e.target.value.toLowerCase();
                applyFilters(filters);
            }, 300);
        });
    }
    
    // Apply initial filters
    applyFilters(filters);
}

function applyFilters(filters) {
    filteredOpportunities = opportunities.filter(opp => {
        // Type filter
        if (filters.type && opp.type !== filters.type) {
            return false;
        }
        
        // Location filter
        if (filters.location && !opp.location.toLowerCase().includes(filters.location.toLowerCase())) {
            return false;
        }
        
        // Category filter
        if (filters.category && opp.category !== filters.category) {
            return false;
        }
        
        // Search filter
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            const searchableText = `${opp.title} ${opp.company} ${opp.description}`.toLowerCase();
            if (!searchableText.includes(searchTerm)) {
                return false;
            }
        }
        
        return true;
    });
    
    renderOpportunities();
}

function renderOpportunities() {
    const container = document.querySelector('.opportunities-grid');
    if (!container) return;
    
    if (filteredOpportunities.length === 0) {
        container.innerHTML = `
            <div class="text-center col-span-full">
                <h3 class="text-xl text-gray-600 mb-4">No opportunities found</h3>
                <p class="text-gray-500">Try adjusting your filters or search terms.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredOpportunities.map(opp => 
        createOpportunityCard(opp)
    ).join('');
    
    // Add click handlers for cards
    container.querySelectorAll('.card').forEach((card, index) => {
        card.addEventListener('click', () => {
            modal.show(filteredOpportunities[index]);
        });
    });
    
    // Animate cards
    container.querySelectorAll('.card').forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('slide-up');
        }, index * 100);
    });
}

function createOpportunityCard(opportunity) {
    const badgeClass = getBadgeClass(opportunity.type);
    
    return `
        <div class="card" data-id="${opportunity.id}">
            <div class="card-content">
                <h3 class="card-title">${opportunity.title}</h3>
                <p class="card-subtitle">${opportunity.company}</p>
                <div class="card-meta">
                    <span>📍 ${opportunity.location}</span>
                    <span>💰 ${opportunity.salary}</span>
                </div>
                <p class="card-description">${opportunity.description.substring(0, 120)}...</p>
                <div class="card-footer">
                    <span class="card-badge ${badgeClass}">${opportunity.type}</span>
                    <small>Posted ${formatDate(opportunity.posted)}</small>
                </div>
            </div>
        </div>
    `;
}

function getBadgeClass(type) {
    const badgeClasses = {
        'Full-time': 'badge-full-time',
        'Part-time': 'badge-part-time',
        'Training': 'badge-training',
        'Apprenticeship': 'badge-apprenticeship'
    };
    return badgeClasses[type] || 'badge-full-time';
}

// Resources page functionality
function initializeResourcesPage() {
    initializeTabs();
    initializeContactForm();
    initializeDownloads();
}

function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Save active tab to storage
            storage.set('activeTab', targetTab);
        });
    });
    
    // Restore active tab from storage
    const activeTab = storage.get('activeTab');
    if (activeTab) {
        const activeButton = document.querySelector(`[data-tab="${activeTab}"]`);
        if (activeButton) {
            activeButton.click();
        }
    }
}

function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        
        // Validate form
        if (validateContactForm(data)) {
            // Submit form
            submitContactForm(data);
        }
    });
}

function validateContactForm(data) {
    const required = ['name', 'email', 'message'];
    const errors = [];
    
    required.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        }
    });
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (errors.length > 0) {
        showFormErrors(errors);
        return false;
    }
    
    return true;
}

function submitContactForm(data) {
    // Show loading state
    const submitButton = document.querySelector('.contact-form button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual submission)
    setTimeout(() => {
        // Redirect to form-action.html with form data
        const params = new URLSearchParams(data);
        window.location.href = `form-action.html?${params.toString()}`;
        
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 1000);
}

function initializeDownloads() {
    const downloadLinks = document.querySelectorAll('.download-link');
    
    downloadLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const resource = this.dataset.resource;
            
            // Track download (save to storage)
            const downloads = storage.get('downloads') || [];
            downloads.push({
                resource: resource,
                timestamp: new Date().toISOString()
            });
            storage.set('downloads', downloads);
            
            // Show success message
            showSuccessMessage('Download started successfully!');
        });
    });
}

// Form handling for all forms
function initializeForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Add validation and enhancement
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Add focus/blur styling
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
            });
            
            // Real-time validation
            if (input.type === 'email') {
                input.addEventListener('input', function() {
                    validateEmailInput(this);
                });
            }
        });
    });
}

function validateEmailInput(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(input.value);
    
    input.classList.toggle('valid', isValid && input.value.length > 0);
    input.classList.toggle('invalid', !isValid && input.value.length > 0);
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
}

function showErrorMessage(message) {
    showNotification(message, 'error');
}

function showSuccessMessage(message) {
    showNotification(message, 'success');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '9999',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    // Set background color based on type
    const colors = {
        success: '#4CAF50',
        error: '#F44336',
        info: '#2196F3'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

function showFormErrors(errors) {
    const errorList = errors.join(', ');
    showErrorMessage(`Please fix the following errors: ${errorList}`);
}

// Export functions for use in other modules
window.AnambraApp = {
    initializeApp,
    showErrorMessage,
    showSuccessMessage,
    formatDate
};