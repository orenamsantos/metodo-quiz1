/**
 * Main application logic for Método Africano
 * Optimized and cleaned version with modern JavaScript practices
 */

class MetodoAfricanoApp {
    constructor() {
        this.currentQuestion = 0;
        this.answers = {};
        this.totalQuestions = getTotalQuestions();
        this.isTransitioning = false;
        
        // Bind methods to preserve context
        this.handleStartQuiz = this.handleStartQuiz.bind(this);
        this.handlePreviousQuestion = this.handlePreviousQuestion.bind(this);
        this.handleNextQuestion = this.handleNextQuestion.bind(this);
        this.handleKeyboardNavigation = this.handleKeyboardNavigation.bind(this);
        
        this.init();
    }
    
    /**
     * Initialize the application
     */
    init() {
        this.cacheElements();
        this.bindEvents();
        this.setupInitialState();
    }
    
    /**
     * Cache DOM elements for better performance
     */
    cacheElements() {
        // Pages
        this.landingPage = document.getElementById('landing-page');
        this.quizPage = document.getElementById('quiz-page');
        this.resultsPage = document.getElementById('results-page');
        
        // Landing page elements
        this.startQuizBtn = document.getElementById('start-quiz-btn');
        
        // Quiz elements
        this.currentQuestionEl = document.getElementById('current-question');
        this.totalQuestionsEl = document.getElementById('total-questions');
        this.progressFill = document.getElementById('progress-fill');
        this.progressPercent = document.getElementById('progress-percent');
        this.questionTitle = document.getElementById('question-title');
        this.optionsContainer = document.getElementById('options-container');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        
        // Results elements
        this.resultIncrease = document.getElementById('result-increase');
        this.currentSize = document.getElementById('current-size');
        this.potentialSize = document.getElementById('potential-size');
        this.visualCurrent = document.getElementById('visual-current');
        this.visualPotential = document.getElementById('visual-potential');
        this.finalButton = document.querySelector('.final-button');
    }
    
    /**
     * Bind event listeners
     */
    bindEvents() {
        // Landing page
        if (this.startQuizBtn) {
            this.startQuizBtn.addEventListener('click', this.handleStartQuiz);
        }
        
        // Quiz navigation
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', this.handlePreviousQuestion);
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', this.handleNextQuestion);
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyboardNavigation);
        
        // Final CTA button
        if (this.finalButton) {
            this.finalButton.addEventListener('click', this.handleFinalCTA);
        }
    }
    
    /**
     * Setup initial application state
     */
    setupInitialState() {
        if (this.totalQuestionsEl) {
            this.totalQuestionsEl.textContent = this.totalQuestions;
        }
        
        // Start landing page animations
        this.startLandingAnimations();
    }
    
    /**
     * Start landing page animations
     */
    startLandingAnimations() {
        // Red line animation is handled by CSS
        // Additional animations can be added here if needed
    }
    
    /**
     * Handle start quiz button click
     */
    handleStartQuiz() {
        this.currentQuestion = 0;
        this.answers = {};
        this.showPage('quiz');
        this.showQuestion(0);
        this.updateProgress();
        
        // Animate quiz entrance
        this.animateQuizEntrance();
    }
    
    /**
     * Handle previous question navigation
     */
    handlePreviousQuestion() {
        if (this.currentQuestion > 0 && !this.isTransitioning) {
            this.currentQuestion--;
            this.transitionToQuestion('prev');
        }
    }
    
    /**
     * Handle next question navigation
     */
    handleNextQuestion() {
        if (!this.nextBtn.disabled && !this.isTransitioning) {
            if (this.currentQuestion < this.totalQuestions - 1) {
                this.currentQuestion++;
                this.transitionToQuestion('next');
            } else {
                // Quiz completed, show results
                this.showResults();
            }
        }
    }
    
    /**
     * Handle keyboard navigation
     */
    handleKeyboardNavigation(event) {
        if (!this.quizPage || !this.quizPage.classList.contains('active')) {
            return;
        }
        
        switch (event.key) {
            case 'ArrowLeft':
                if (!this.prevBtn.disabled) {
                    this.handlePreviousQuestion();
                }
                break;
            case 'ArrowRight':
                if (!this.nextBtn.disabled) {
                    this.handleNextQuestion();
                }
                break;
            case '1':
            case '2':
            case '3':
            case '4':
                const optionIndex = parseInt(event.key) - 1;
                const options = this.optionsContainer.querySelectorAll('.option-button');
                if (options[optionIndex]) {
                    options[optionIndex].click();
                }
                break;
        }
    }
    
    /**
     * Handle final CTA button click
     */
    handleFinalCTA() {
        // This would typically redirect to a purchase page or external link
        console.log('Final CTA clicked - redirect to purchase page');
        // window.location.href = 'https://purchase-page.com';
    }
    
    /**
     * Show a specific page
     */
    showPage(pageName) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show target page
        const targetPage = document.getElementById(`${pageName}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
        }
    }
    
    /**
     * Show a specific question
     */
    showQuestion(questionIndex) {
        const question = getQuestion(questionIndex);
        if (!question) return;
        
        // Update question title
        if (this.questionTitle) {
            this.questionTitle.textContent = question.question;
        }
        
        // Clear previous options
        if (this.optionsContainer) {
            this.optionsContainer.innerHTML = '';
        }
        
        // Create options based on question type
        if (question.type === 'multiple-choice') {
            this.createMultipleChoiceOptions(question, questionIndex);
        } else if (question.type === 'input') {
            this.createInputOption(question, questionIndex);
        }
        
        // Update navigation buttons
        this.updateNavigationButtons();
        
        // Update progress
        this.updateProgress();
        
        // Animate options
        this.animateOptions();
    }
    
    /**
     * Create multiple choice options
     */
    createMultipleChoiceOptions(question, questionIndex) {
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-button';
            button.setAttribute('data-value', option.value);
            button.setAttribute('role', 'radio');
            button.setAttribute('aria-checked', 'false');
            
            // Check if this option was previously selected
            if (this.answers[questionIndex] === option.value) {
                button.classList.add('selected');
                button.setAttribute('aria-checked', 'true');
            }
            
            button.innerHTML = `
                <div class="option-radio"></div>
                <span>${option.text}</span>
            `;
            
            button.addEventListener('click', () => {
                this.selectOption(questionIndex, option.value, button);
            });
            
            this.optionsContainer.appendChild(button);
        });
    }
    
    /**
     * Create input option for numeric questions
     */
    createInputOption(question, questionIndex) {
        const container = document.createElement('div');
        container.className = 'input-container';
        
        // Warning info
        if (question.warningInfo) {
            const warning = document.createElement('div');
            warning.className = 'input-warning';
            warning.innerHTML = `
                <div class="input-warning-title">${question.warningInfo.title}</div>
                <div class="input-warning-text">${question.warningInfo.text}</div>
            `;
            container.appendChild(warning);
        }
        
        // Help text
        if (question.helpText) {
            const helpText = document.createElement('div');
            helpText.className = 'input-help';
            helpText.textContent = question.helpText;
            container.appendChild(helpText);
        }
        
        // Input field
        const input = document.createElement('input');
        input.type = question.inputType || 'text';
        input.className = 'size-input';
        input.placeholder = question.placeholder || '';
        input.id = `question-${questionIndex}-input`;
        input.setAttribute('aria-label', question.question);
        
        // Set validation attributes
        if (question.validation) {
            if (question.validation.min !== undefined) {
                input.min = question.validation.min;
            }
            if (question.validation.max !== undefined) {
                input.max = question.validation.max;
            }
            if (question.validation.required) {
                input.required = true;
            }
        }
        
        // Set previous value if exists
        if (this.answers[questionIndex] !== undefined) {
            input.value = this.answers[questionIndex];
        }
        
        container.appendChild(input);
        
        // Input validation and auto-save
        input.addEventListener('input', () => {
            this.validateAndSaveInput(questionIndex, input, question.validation);
        });
        
        input.addEventListener('blur', () => {
            this.validateAndSaveInput(questionIndex, input, question.validation);
        });
        
        // Enter key to proceed
        input.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' && !this.nextBtn.disabled) {
                this.handleNextQuestion();
            }
        });
        
        this.optionsContainer.appendChild(container);
        
        // Focus input after animation
        setTimeout(() => {
            input.focus();
        }, 300);
    }
    
    /**
     * Select an option for multiple choice questions
     */
    selectOption(questionIndex, value, buttonElement) {
        // Remove selection from other options
        const allOptions = this.optionsContainer.querySelectorAll('.option-button');
        allOptions.forEach(option => {
            option.classList.remove('selected');
            option.setAttribute('aria-checked', 'false');
        });
        
        // Select current option
        buttonElement.classList.add('selected');
        buttonElement.setAttribute('aria-checked', 'true');
        
        // Save answer
        this.answers[questionIndex] = value;
        
        // Enable next button
        this.updateNavigationButtons();
        

    }
    
    /**
     * Validate and save input for numeric questions
     */
    validateAndSaveInput(questionIndex, input, validation) {
        const value = input.value.trim();
        const validationResult = validateInput(value, validation);
        
        // Reset input styling
        input.style.borderColor = '';
        input.classList.remove('shake');
        
        if (validationResult.isValid && value) {
            this.answers[questionIndex] = value;
            input.style.borderColor = 'var(--color-primary)';
        } else if (value) {
            input.style.borderColor = '#ff6b6b';
            input.classList.add('shake');
            
            // Show validation message (could be enhanced with a tooltip)
            console.log('Validation error:', validationResult.message);
        }
        
        this.updateNavigationButtons();
    }
    
    /**
     * Update navigation button states
     */
    updateNavigationButtons() {
        const hasAnswer = this.answers[this.currentQuestion] !== undefined;
        
        // Previous button
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentQuestion === 0;
        }
        
        // Next button
        if (this.nextBtn) {
            if (this.currentQuestion === this.totalQuestions - 1) {
                this.nextBtn.innerHTML = `
                    Analisar Resultados
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                    </svg>
                `;
            } else {
                this.nextBtn.innerHTML = `
                    Próximo
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                    </svg>
                `;
            }
            
            this.nextBtn.disabled = !hasAnswer;
        }
    }
    
    /**
     * Update progress indicators
     */
    updateProgress() {
        const progress = ((this.currentQuestion + 1) / this.totalQuestions) * 100;
        
        if (this.currentQuestionEl) {
            this.currentQuestionEl.textContent = this.currentQuestion + 1;
        }
        
        if (this.progressPercent) {
            this.progressPercent.textContent = Math.round(progress);
        }
        
        if (this.progressFill) {
            this.animateProgressBar(this.progressFill, progress);
        }
        
        // Update progress bar aria-valuenow
        const progressBar = document.querySelector('.quiz-progress[role="progressbar"]');
        if (progressBar) {
            progressBar.setAttribute('aria-valuenow', Math.round(progress));
        }
    }
    
    /**
     * Transition to a question with animation
     */
    transitionToQuestion(direction) {
        this.isTransitioning = true;
        
        const questionCard = this.quizPage.querySelector('.question-card');
        if (!questionCard) {
            this.showQuestion(this.currentQuestion);
            this.isTransitioning = false;
            return;
        }
        
        const translateX = direction === 'next' ? '30px' : '-30px';
        const reverseTranslateX = direction === 'next' ? '-30px' : '30px';
        
        // Animate out
        questionCard.style.transform = `translateX(${translateX})`;
        questionCard.style.opacity = '0.7';
        
        setTimeout(() => {
            this.showQuestion(this.currentQuestion);
            questionCard.style.transform = `translateX(${reverseTranslateX})`;
            
            setTimeout(() => {
                questionCard.style.transition = 'all 0.3s ease';
                questionCard.style.transform = 'translateX(0)';
                questionCard.style.opacity = '1';
                
                setTimeout(() => {
                    questionCard.style.transition = '';
                    this.isTransitioning = false;
                }, 300);
            }, 50);
        }, 150);
    }
    
    /**
     * Show results page with calculated data
     */
    showResults() {
        // Calculate results
        const results = calculateResults(this.answers);
        
        // Update results page
        if (this.resultIncrease) {
            this.resultIncrease.textContent = `${results.potentialIncrease}cm`;
        }
        
        if (this.currentSize) {
            this.currentSize.textContent = `${results.currentSize}cm`;
        }
        
        if (this.potentialSize) {
            this.potentialSize.textContent = `${results.potentialSize}cm`;
        }
        
        // Update visual progress bar
        if (this.visualCurrent && this.visualPotential) {
            this.visualCurrent.textContent = `${results.currentSize}cm`;
            this.visualPotential.textContent = `${results.potentialSize}cm`;
        }
        
        // Show results page
        this.showPage('results');
        
        // Animate results elements
        this.animateResultsEntrance();
    }
    
    /**
     * Animate quiz entrance
     */
    animateQuizEntrance() {
        setTimeout(() => {
            const quizHeader = this.quizPage.querySelector('.quiz-header');
            const questionCard = this.quizPage.querySelector('.question-card');
            
            if (quizHeader) {
                this.animateElement(quizHeader, 'slideInDown', 600, 0);
            }
            
            if (questionCard) {
                this.animateElement(questionCard, 'slideInUp', 600, 200);
            }
        }, 100);
    }
    
    /**
     * Animate results entrance
     */
    animateResultsEntrance() {
        setTimeout(() => {
            const resultsHeader = this.resultsPage.querySelector('.results-header');
            const resultCard = this.resultsPage.querySelector('.result-card');
            
            if (resultsHeader) {
                this.animateElement(resultsHeader, 'slideInDown', 600, 0);
            }
            
            if (resultCard) {
                this.animateElement(resultCard, 'slideInUp', 600, 200);
            }
        }, 100);
    }
    
    /**
     * Animate options appearance
     */
    animateOptions() {
        const options = this.optionsContainer.querySelectorAll('.option-button, .input-container');
        options.forEach((option, index) => {
            this.animateElement(option, 'slideInUp', 300, index * 100);
        });
    }
    
    /**
     * Animate progress bar
     */
    animateProgressBar(element, targetWidth) {
        element.style.width = '0%';
        element.style.transition = 'width 0.5s ease-out';
        
        setTimeout(() => {
            element.style.width = targetWidth + '%';
        }, 100);
    }
    
    /**
     * Generic element animation
     */
    animateElement(element, animationType, duration = 500, delay = 0) {
        if (!element) return;
        
        const animations = {
            slideInUp: {
                from: { opacity: '0', transform: 'translateY(30px)' },
                to: { opacity: '1', transform: 'translateY(0)' }
            },
            slideInDown: {
                from: { opacity: '0', transform: 'translateY(-30px)' },
                to: { opacity: '1', transform: 'translateY(0)' }
            },
            fadeIn: {
                from: { opacity: '0' },
                to: { opacity: '1' }
            }
        };
        
        const animation = animations[animationType];
        if (!animation) return;
        
        // Set initial state
        Object.assign(element.style, animation.from);
        element.style.transition = `all ${duration}ms ease`;
        
        setTimeout(() => {
            Object.assign(element.style, animation.to);
        }, delay);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MetodoAfricanoApp();
});

// Handle page visibility changes for better performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, pause animations or reduce activity
        console.log('Page hidden - reducing activity');
    } else {
        // Page is visible, resume normal activity
        console.log('Page visible - resuming activity');
    }
});

// Handle errors gracefully
window.addEventListener('error', (event) => {
    console.error('Application error:', event.error);
    // Could send error reports to analytics service
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault();
});
