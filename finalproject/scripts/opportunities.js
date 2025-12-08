// Global variables for opportunities management
        let allOpportunities = [];
        let filteredOpportunities = [];
        let currentPage = 1;
        const itemsPerPage = 12;

        // Initialize opportunities page
        document.addEventListener('DOMContentLoaded', function() {
            loadOpportunities();
            initializeFilters();
        });

        // Load opportunities from JSON
        async function loadOpportunities() {
            try {
                const response = await fetch('./opportunities.json');
                allOpportunities = await response.json();
                filteredOpportunities = [...allOpportunities];
                renderOpportunities();
                updateResultsCounter();
            } catch (error) {
                console.error('Failed to load opportunities:', error);
                showErrorMessage('Failed to load opportunities. Please try again later.');
            }
        }

        // Initialize filter functionality
        function initializeFilters() {
            const filterForm = document.getElementById('opportunity-filters');
            const searchInput = filterForm.querySelector('input[name="search"]');
            const selectInputs = filterForm.querySelectorAll('select');

            // Search functionality with debounce
            let searchTimeout;
            searchInput.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    applyFilters();
                }, 300);
            });

            // Select change handlers
            selectInputs.forEach(select => {
                select.addEventListener('change', applyFilters);
            });

            // Load saved filters from URL parameters
            loadFiltersFromURL();
        }

        // Apply filters to opportunities
        function applyFilters() {
            const formData = new FormData(document.getElementById('opportunity-filters'));
            const filters = Object.fromEntries(formData.entries());

            filteredOpportunities = allOpportunities.filter(opp => {
                // Search filter
                if (filters.search) {
                    const searchTerm = filters.search.toLowerCase();
                    const searchableText = `${opp.title} ${opp.company} ${opp.description} ${opp.location}`.toLowerCase();
                    if (!searchableText.includes(searchTerm)) {
                        return false;
                    }
                }

                // Type filter
                if (filters.type && opp.type !== filters.type) {
                    return false;
                }

                // Location filter
                if (filters.location && opp.location !== filters.location) {
                    return false;
                }

                // Category filter
                if (filters.category && opp.category !== filters.category) {
                    return false;
                }

                return true;
            });

            currentPage = 1;
            renderOpportunities();
            updateResultsCounter();
            updateURLWithFilters(filters);
        }

        // Render opportunities grid
        function renderOpportunities() {
            const container = document.getElementById('opportunities-grid');
            const noResults = document.getElementById('no-results');
            const loadMoreContainer = document.getElementById('load-more-container');

            if (filteredOpportunities.length === 0) {
                container.innerHTML = '';
                noResults.style.display = 'block';
                loadMoreContainer.style.display = 'none';
                return;
            }

            noResults.style.display = 'none';

            // Calculate pagination
            const startIndex = 0;
            const endIndex = currentPage * itemsPerPage;
            const opportunitiesToShow = filteredOpportunities.slice(startIndex, endIndex);

            // Render opportunity cards
            container.innerHTML = opportunitiesToShow.map(opp => createOpportunityCard(opp)).join('');

            // Show/hide load more button
            if (endIndex < filteredOpportunities.length) {
                loadMoreContainer.style.display = 'block';
            } else {
                loadMoreContainer.style.display = 'none';
            }

            // Add click handlers for cards
            container.querySelectorAll('.card').forEach((card, index) => {
                card.addEventListener('click', () => {
                    showOpportunityModal(opportunitiesToShow[index]);
                });
            });

            // Animate cards
            container.querySelectorAll('.card').forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('fade-in');
                }, index * 100);
            });
        }

        // Create opportunity card HTML
        function createOpportunityCard(opp) {
            const badgeClass = getBadgeClass(opp.type);
            const postedDate = formatRelativeDate(opp.posted);

            return `
                <div class="card" data-id="${opp.id}">
                    <div class="card-content">
                        <h3 class="card-title">${opp.title}</h3>
                        <p class="card-subtitle">${opp.company}</p>
                        <div class="card-meta">
                            <span>📍 ${opp.location}</span>
                            <span>💰 ${opp.salary}</span>
                        </div>
                        <p class="card-description">${truncateText(opp.description, 120)}</p>
                        <div class="card-footer">
                            <span class="card-badge ${badgeClass}">${opp.type}</span>
                            <small>Posted ${postedDate}</small>
                        </div>
                    </div>
                </div>
            `;
        }

        // Get badge class based on opportunity type
        function getBadgeClass(type) {
            const badgeClasses = {
                'Full-time': 'badge-full-time',
                'Part-time': 'badge-part-time',
                'Training': 'badge-training',
                'Apprenticeship': 'badge-apprenticeship'
            };
            return badgeClasses[type] || 'badge-full-time';
        }

        // Format relative date
        function formatRelativeDate(dateString) {
            if (!dateString) return 'N/A';
            
            const date = new Date(dateString);
            const now = new Date();
            const diffInSeconds = Math.floor((now - date) / 1000);
            
            if (diffInSeconds < 86400) return 'Today';
            if (diffInSeconds < 172800) return 'Yesterday';
            if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
            
            return date.toLocaleDateString();
        }

        // Truncate text
        function truncateText(text, maxLength) {
            if (!text || text.length <= maxLength) return text;
            return text.substr(0, maxLength) + '...';
        }

        // Show opportunity modal
        function showOpportunityModal(opportunity) {
            // Create modal content
            const modalContent = `
                <div class="opportunity-details">
                    <div class="opportunity-company">${opportunity.company}</div>
                    
                    <div class="opportunity-meta">
                        <div class="meta-item">
                            <span class="meta-label">Location</span>
                            <span class="meta-value">📍 ${opportunity.location}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Type</span>
                            <span class="meta-value">${opportunity.type}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Category</span>
                            <span class="meta-value">${opportunity.category}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Salary</span>
                            <span class="meta-value">💰 ${opportunity.salary}</span>
                        </div>
                    </div>
                    
                    <div class="opportunity-description">
                        ${opportunity.description}
                    </div>
                    
                    ${opportunity.requirements && opportunity.requirements.length > 0 ? `
                    <div class="requirements-section">
                        <h4>Requirements</h4>
                        <ul class="requirements-list">
                            ${opportunity.requirements.map(req => `<li>${req}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}
                    
                    ${opportunity.benefits && opportunity.benefits.length > 0 ? `
                    <div class="benefits-section">
                        <h4>Benefits</h4>
                        <ul class="benefits-list">
                            ${opportunity.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}
                    
                    <div class="opportunity-footer">
                        <div class="opportunity-date">
                            Posted: ${formatRelativeDate(opportunity.posted)}<br>
                            ${opportunity.deadline ? `Deadline: ${formatRelativeDate(opportunity.deadline)}` : ''}
                        </div>
                        <button class="apply-button" onclick="handleApply('${opportunity.title}', '${opportunity.company}')">
                            Apply Now
                        </button>
                    </div>
                </div>
            `;

            // Create and show modal
            const modal = createModal(opportunity.title, modalContent);
            document.body.appendChild(modal);
            
            // Show modal
            setTimeout(() => {
                modal.classList.add('active');
            }, 100);
        }

        // Create modal element
        function createModal(title, content) {
            const modal = document.createElement('div');
            modal.className = 'modal-overlay';
            modal.innerHTML = `
                <div class="modal-content">
                    <button class="modal-close" onclick="closeModal(this.closest('.modal-overlay'))">&times;</button>
                    <div class="modal-header">
                        <h2 class="modal-title">${title}</h2>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                </div>
            `;
            return modal;
        }

        // Close modal
        function closeModal(modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        }

        // Handle apply button click
        function handleApply(title, company) {
            alert(`Application process for "${title}" at ${company} would open here. This is a demo - in a real application, this would redirect to an application form or open an application modal.`);
        }

        // Update results counter
        function updateResultsCounter() {
            const resultsText = document.getElementById('results-text');
            const total = filteredOpportunities.length;
            const showing = Math.min(currentPage * itemsPerPage, total);
            
            if (total === 0) {
                resultsText.textContent = 'No opportunities found';
            } else if (total <= itemsPerPage) {
                resultsText.textContent = `Showing ${total} opportunities`;
            } else {
                resultsText.textContent = `Showing ${showing} of ${total} opportunities`;
            }
        }

        // Load more opportunities
        document.getElementById('load-more-btn').addEventListener('click', function() {
            currentPage++;
            renderOpportunities();
            updateResultsCounter();
        });

        // Clear all filters
        function clearAllFilters() {
            const filterForm = document.getElementById('opportunity-filters');
            filterForm.reset();
            applyFilters();
        }

        // Load filters from URL parameters
        function loadFiltersFromURL() {
            const params = new URLSearchParams(window.location.search);
            const filterForm = document.getElementById('opportunity-filters');
            
            ['search', 'type', 'location', 'category'].forEach(param => {
                if (params.has(param)) {
                    const input = filterForm.querySelector(`[name="${param}"]`);
                    if (input) {
                        input.value = params.get(param);
                    }
                }
            });
            
            applyFilters();
        }

        // Update URL with filters
        function updateURLWithFilters(filters) {
            const params = new URLSearchParams();
            
            Object.keys(filters).forEach(key => {
                if (filters[key]) {
                    params.set(key, filters[key]);
                }
            });
            
            const newURL = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
            window.history.replaceState({}, '', newURL);
        }

        // Opportunity alerts form
        document.getElementById('opportunity-alerts').addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[name="email"]').value;
            const preferences = this.querySelector('select[name="preferences"]').value;
            
            const button = this.querySelector('button');
            const originalText = button.textContent;
            button.textContent = 'Subscribing...';
            button.disabled = true;
            
            setTimeout(() => {
                alert(`Perfect! We'll send ${preferences} opportunities to ${email}`);
                this.reset();
                button.textContent = originalText;
                button.disabled = false;
            }, 1000);
        });