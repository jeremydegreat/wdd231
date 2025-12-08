// Modal Module - Handles modal dialog functionality with accessibility features

class Modal {
    constructor() {
        this.currentModal = null;
        this.previousFocus = null;
        this.isOpen = false;
        
        // Create modal container if it doesn't exist
        this.createModalContainer();
        
        // Bind event handlers
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    // Create modal container in DOM
    createModalContainer() {
        if (document.getElementById('modal-container')) {
            return;
        }

        const container = document.createElement('div');
        container.id = 'modal-container';
        container.innerHTML = `
            <div id="modal-overlay" class="modal-overlay" role="dialog" aria-modal="true" aria-hidden="true">
                <div class="modal-content" role="document">
                    <button class="modal-close" aria-label="Close modal" type="button">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <div class="modal-header">
                        <h2 id="modal-title" class="modal-title"></h2>
                    </div>
                    <div class="modal-body">
                        <div id="modal-content"></div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(container);
        
        // Add modal styles
        this.addModalStyles();
        
        // Bind close button event
        const closeButton = container.querySelector('.modal-close');
        closeButton.addEventListener('click', () => this.close());
        
        // Bind overlay click event
        const overlay = container.querySelector('.modal-overlay');
        overlay.addEventListener('click', this.handleClickOutside);
    }

    // Add modal styles to document
    addModalStyles() {
        if (document.getElementById('modal-styles')) {
            return;
        }

        const styles = document.createElement('style');
        styles.id = 'modal-styles';
        styles.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(4px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }

            .modal-overlay.active {
                opacity: 1;
                visibility: visible;
            }

            .modal-content {
                background: white;
                border-radius: 16px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                position: relative;
                transform: translateY(-50px) scale(0.9);
                transition: all 0.3s ease;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            }

            .modal-overlay.active .modal-content {
                transform: translateY(0) scale(1);
            }

            .modal-close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                font-size: 1.5rem;
                color: #666;
                cursor: pointer;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                z-index: 1;
            }

            .modal-close:hover {
                background: #f5f5f5;
                color: #333;
            }

            .modal-header {
                padding: 2rem 2rem 1rem;
                border-bottom: 1px solid #e0e0e0;
            }

            .modal-title {
                font-family: 'Poppins', sans-serif;
                font-size: 1.5rem;
                font-weight: 600;
                color: #00796B;
                margin: 0;
                padding-right: 3rem;
            }

            .modal-body {
                padding: 1.5rem 2rem 2rem;
            }

            /* Opportunity modal styles */
            .opportunity-details {
                line-height: 1.6;
            }

            .opportunity-company {
                font-size: 1.125rem;
                color: #666;
                margin-bottom: 1rem;
            }

            .opportunity-meta {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 1rem;
                margin-bottom: 1.5rem;
                padding: 1rem;
                background: #f8f9fa;
                border-radius: 8px;
            }

            .meta-item {
                display: flex;
                flex-direction: column;
            }

            .meta-label {
                font-size: 0.875rem;
                color: #666;
                font-weight: 500;
                margin-bottom: 0.25rem;
            }

            .meta-value {
                font-weight: 600;
                color: #333;
            }

            .opportunity-description {
                margin-bottom: 1.5rem;
                font-size: 1rem;
                line-height: 1.7;
            }

            .requirements-section,
            .benefits-section {
                margin-bottom: 1.5rem;
            }

            .requirements-section h4,
            .benefits-section h4 {
                font-size: 1.125rem;
                font-weight: 600;
                color: #00796B;
                margin-bottom: 0.75rem;
            }

            .requirements-list,
            .benefits-list {
                list-style: none;
                padding: 0;
            }

            .requirements-list li,
            .benefits-list li {
                padding: 0.5rem 0;
                padding-left: 1.5rem;
                position: relative;
            }

            .requirements-list li::before {
                content: '✓';
                position: absolute;
                left: 0;
                color: #4CAF50;
                font-weight: bold;
            }

            .benefits-list li::before {
                content: '★';
                position: absolute;
                left: 0;
                color: #FFB300;
            }

            .opportunity-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 2rem;
                padding-top: 1.5rem;
                border-top: 1px solid #e0e0e0;
            }

            .opportunity-date {
                font-size: 0.875rem;
                color: #666;
            }

            .apply-button {
                background: #00796B;
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .apply-button:hover {
                background: #00695C;
                transform: translateY(-1px);
            }

            /* Responsive styles */
            @media (max-width: 768px) {
                .modal-content {
                    width: 95%;
                    margin: 1rem;
                }

                .modal-header {
                    padding: 1.5rem 1.5rem 1rem;
                }

                .modal-body {
                    padding: 1rem 1.5rem 1.5rem;
                }

                .opportunity-meta {
                    grid-template-columns: 1fr;
                }

                .opportunity-footer {
                    flex-direction: column;
                    gap: 1rem;
                    align-items: stretch;
                }
            }
        `;

        document.head.appendChild(styles);
    }

    // Show modal with opportunity details
    show(opportunity) {
        if (this.isOpen) {
            this.close();
        }

        this.previousFocus = document.activeElement;
        this.currentModal = document.getElementById('modal-overlay');
        
        // Update modal content
        this.updateModalContent(opportunity);
        
        // Show modal
        this.currentModal.classList.add('active');
        this.currentModal.setAttribute('aria-hidden', 'false');
        
        // Add event listeners
        document.addEventListener('keydown', this.handleKeyDown);
        
        // Focus management
        const focusableElements = this.getFocusableElements();
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        this.isOpen = true;
    }

    // Close modal
    close() {
        if (!this.isOpen || !this.currentModal) {
            return;
        }

        // Hide modal
        this.currentModal.classList.remove('active');
        this.currentModal.setAttribute('aria-hidden', 'true');
        
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeyDown);
        
        // Restore focus
        if (this.previousFocus) {
            this.previousFocus.focus();
        }
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        this.isOpen = false;
        this.currentModal = null;
    }

    // Update modal content with opportunity details
    updateModalContent(opportunity) {
        const title = document.getElementById('modal-title');
        const content = document.getElementById('modal-content');
        
        title.textContent = opportunity.title;
        
        content.innerHTML = `
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
                        Posted: ${formatDate(opportunity.posted)}<br>
                        ${opportunity.deadline ? `Deadline: ${formatDate(opportunity.deadline)}` : ''}
                    </div>
                    <button class="apply-button" onclick="handleApplyClick('${opportunity.title}', '${opportunity.company}')">
                        Apply Now
                    </button>
                </div>
            </div>
        `;
    }

    // Handle keyboard events
    handleKeyDown(event) {
        if (!this.isOpen) return;

        const focusableElements = this.getFocusableElements();
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        switch (event.key) {
            case 'Escape':
                event.preventDefault();
                this.close();
                break;
                
            case 'Tab':
                if (event.shiftKey) {
                    if (document.activeElement === firstElement) {
                        event.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        event.preventDefault();
                        firstElement.focus();
                    }
                }
                break;
        }
    }

    // Handle click outside modal
    handleClickOutside(event) {
        if (event.target === this.currentModal) {
            this.close();
        }
    }

    // Get focusable elements within modal
    getFocusableElements() {
        if (!this.currentModal) return [];

        const focusableSelectors = [
            'button',
            'a[href]',
            'input',
            'select',
            'textarea',
            '[tabindex]:not([tabindex="-1"])'
        ];

        return Array.from(
            this.currentModal.querySelectorAll(focusableSelectors.join(', '))
        ).filter(el => !el.disabled && el.offsetHeight > 0);
    }
}

// Utility function to format date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Handle apply button click
function handleApplyClick(title, company) {
    // In a real application, this would redirect to an application form
    // or open an application modal
    alert(`Application process for "${title}" at ${company} would open here. This is a demo.`);
}

// Create and export modal instance
const modal = new Modal();

export { modal };