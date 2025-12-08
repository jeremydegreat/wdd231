// Initialize resources page
        document.addEventListener('DOMContentLoaded', function() {
            initializeTabs();
            initializeContactForm();
        });

        // Tab switching functionality
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

                    // Update URL hash for bookmarking
                    window.location.hash = targetTab;
                });
            });

            // Check for hash in URL and activate corresponding tab
            const hash = window.location.hash.substring(1);
            if (hash) {
                const targetButton = document.querySelector(`[data-tab="${hash}"]`);
                if (targetButton) {
                    targetButton.click();
                }
            }
        }

        // Contact form handling
        function initializeContactForm() {
            const contactForm = document.getElementById('contact-form');
            
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form data
                const formData = new FormData(this);
                const data = Object.fromEntries(formData.entries());
                
                // Validate form
                if (validateContactForm(data)) {
                    submitContactForm(data);
                }
            });

            // Real-time validation
            const inputs = contactForm.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', function() {
                    validateField(this);
                });
            });
        }

        // Validate contact form
        function validateContactForm(data) {
            const required = ['firstName', 'lastName', 'email', 'category', 'subject', 'message'];
            let isValid = true;

            required.forEach(field => {
                const input = document.getElementById(field);
                if (!data[field] || data[field].trim() === '') {
                    showFieldError(input, 'This field is required');
                    isValid = false;
                } else {
                    clearFieldError(input);
                }
            });

            // Email validation
            const emailInput = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (data.email && !emailRegex.test(data.email)) {
                showFieldError(emailInput, 'Please enter a valid email address');
                isValid = false;
            }

            // Phone validation (optional but if provided, should be valid)
            const phoneInput = document.getElementById('phone');
            if (data.phone && !isValidPhoneNumber(data.phone)) {
                showFieldError(phoneInput, 'Please enter a valid Nigerian phone number');
                isValid = false;
            }

            return isValid;
        }

        // Validate single field
        function validateField(field) {
            const value = field.value.trim();
            
            if (field.hasAttribute('required') && !value) {
                showFieldError(field, 'This field is required');
                return false;
            }

            if (field.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    showFieldError(field, 'Please enter a valid email address');
                    return false;
                }
            }

            if (field.type === 'tel' && value) {
                if (!isValidPhoneNumber(value)) {
                    showFieldError(field, 'Please enter a valid Nigerian phone number');
                    return false;
                }
            }

            clearFieldError(field);
            return true;
        }

        // Validate Nigerian phone number
        function isValidPhoneNumber(phone) {
            const phoneRegex = /^(\+?234|0)[789][01]\d{8}$/;
            return phoneRegex.test(phone.replace(/\s/g, ''));
        }

        // Show field error
        function showFieldError(field, message) {
            clearFieldError(field);
            
            field.classList.add('error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.style.cssText = `
                color: #F44336;
                font-size: 0.875rem;
                margin-top: 0.25rem;
            `;
            errorDiv.textContent = message;
            
            field.parentNode.appendChild(errorDiv);
        }

        // Clear field error
        function clearFieldError(field) {
            field.classList.remove('error');
            const errorDiv = field.parentNode.querySelector('.field-error');
            if (errorDiv) {
                errorDiv.remove();
            }
        }

        // Submit contact form
        function submitContactForm(data) {
            const submitButton = document.querySelector('#contact-form button[type="submit"]');
            const originalText = submitButton.textContent;
            
            // Show loading state
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                // Show success message
                const successMessage = document.getElementById('success-message');
                successMessage.classList.add('show');

                // Reset form
                document.getElementById('contact-form').reset();

                // Restore button
                submitButton.textContent = originalText;
                submitButton.disabled = false;

                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMessage.classList.remove('show');
                }, 5000);

                // Log form data (in real application, this would be sent to server)
                console.log('Form submitted:', data);

            }, 1500);
        }

        // Download resource functionality
        function downloadResource(resourceType) {
            const resources = {
                'cv-template': {
                    name: 'Professional CV Template',
                    filename: 'Anambra_Jobs_CV_Template.pdf',
                    content: 'This is a professional CV template designed for the Nigerian job market. In a real application, this would download an actual PDF file with proper formatting and content guidelines.'
                },
                'interview-guide': {
                    name: 'Interview Success Guide',
                    filename: 'Interview_Success_Guide.pdf',
                    content: 'This comprehensive interview guide covers common questions, preparation strategies, and follow-up techniques. In a real application, this would be a detailed 45-page PDF with practical examples and tips.'
                },
                'career-guide': {
                    name: 'Career Planning Guide',
                    filename: 'Career_Planning_Guide.pdf',
                    content: 'Step-by-step career planning guide with goal setting and action plans. In a real application, this would be a comprehensive 32-page PDF with worksheets and planning templates.'
                },
                'networking-guide': {
                    name: 'Professional Networking Guide',
                    filename: 'Networking_Guide.pdf',
                    content: 'Professional networking strategies and tips for building meaningful career relationships. In a real application, this would be a practical guide with actionable networking advice.'
                }
            };

            const resource = resources[resourceType];
            if (resource) {
                // Track download
                console.log(`Downloading: ${resource.name}`);
                
                // Create and download file
                const blob = new Blob([resource.content], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = resource.filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                // Show success message
                alert(`${resource.name} downloaded successfully! Check your downloads folder.`);
            }
        }

        // Skills assessment functionality
        function startSkillsAssessment() {
            const questions = [
                "What is your current level of education?",
                "Which industry interests you most?",
                "What is your current employment status?",
                "How many years of work experience do you have?",
                "What are your primary skills?",
                "What type of work environment do you prefer?",
                "What are your career goals for the next 2-5 years?",
                "Which skills would you like to develop?"
            ];

            let currentQuestion = 0;
            let answers = [];

            function askQuestion() {
                if (currentQuestion < questions.length) {
                    const answer = prompt(`Question ${currentQuestion + 1} of ${questions.length}:\n\n${questions[currentQuestion]}`);
                    if (answer !== null) {
                        answers.push(answer);
                        currentQuestion++;
                        askQuestion();
                    }
                } else {
                    showAssessmentResults();
                }
            }

            function showAssessmentResults() {
                const recommendations = [
                    "Consider our Code Anambra program for tech skills",
                    "Explore TVET training opportunities in your area",
                    "Look into apprenticeship programs with local companies",
                    "Update your CV with our professional template",
                    "Schedule a career counseling session"
                ];

                let results = "Based on your responses, here are our recommendations:\n\n";
                recommendations.forEach((rec, index) => {
                    results += `${index + 1}. ${rec}\n`;
                });

                results += "\nFor personalized guidance, please contact our career counselors.";
                alert(results);
            }

            askQuestion();
        }

        // Add CSS for modal and error states
        const additionalStyles = `
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

            .form-control.error {
                border-color: #F44336;
            }

            .field-error {
                color: #F44336;
                font-size: 0.875rem;
                margin-top: 0.25rem;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = additionalStyles;
        document.head.appendChild(styleSheet);