// FinFree - Personal Finance Management App
// Main application logic - Core functionality only (no calculator code)

const FinFree = {
    // Data storage
    data: {
        expenses: [],
        income: [],
        goals: [],
        budgets: {},
        pettyCash: [],
        settings: {
            dailyLimit: 20,
            currency: '$'
        }
    },

    // Initialize the application
    init() {
        console.log('Initializing FinFree application...');
        this.loadData();
        this.bindEvents();
        this.loadDashboard();
        this.setCurrentDate();
        console.log('FinFree application initialized successfully');
    },

    // Load data from localStorage
    loadData() {
        try {
            const stored = localStorage.getItem('finFreeData');
            if (stored) {
                this.data = { ...this.data, ...JSON.parse(stored) };
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
    },

    // Save data to localStorage
    saveData() {
        try {
            localStorage.setItem('finFreeData', JSON.stringify(this.data));
        } catch (error) {
            console.error('Error saving data:', error);
        }
    },

    // Initialize events after components are loaded (for modular system)
    initializeEvents() {
        console.log('FinFree initializing events after component load...');
        this.bindEvents();
        this.showSection('dashboard');
    },

    // Bind event listeners
    bindEvents() {
        console.log('Binding events...');
        
        // Navigation - check if elements exist first
        const navLinks = document.querySelectorAll('.nav-link');
        if (navLinks.length > 0) {
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const section = link.dataset.section;
                    this.showSection(section);
                    this.updateNavigation(link);
                });
            });
        }

        // Mobile navigation toggle
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });

            // Close mobile menu when clicking on a link
            const navLinksInMenu = navMenu.querySelectorAll('.nav-link');
            navLinksInMenu.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                });
            });
        }
        
        // Initialize modal backdrop clicks
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('modal-backdrop')) {
                this.hideModal();
            }
        });

        // Close modal when clicking close button
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('modal-close') || event.target.closest('.modal-close')) {
                this.hideModal();
            }
        });

        console.log('Events bound successfully');
    },

    // Show specific section
    showSection(sectionName) {
        console.log('Showing section:', sectionName);
        
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            console.log('Section shown:', sectionName);
        } else {
            console.error('Section not found:', sectionName);
        }

        // Update specific section content
        this.updateSectionContent(sectionName);
    },

    // Update section content
    updateSectionContent(sectionName) {
        switch (sectionName) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'expenses':
                this.displayExpenses();
                break;
            case 'budget':
                this.displayBudget();
                break;
            case 'earnings':
                this.displayIncome();
                break;
            case 'goals':
                this.displayGoals();
                break;
            case 'petty-cash':
                this.updatePettyCashDisplay();
                break;
        }
    },

    // Update navigation active state
    updateNavigation(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    },

    // Set current date in date inputs
    setCurrentDate() {
        const today = new Date().toISOString().split('T')[0];
        const currentTime = new Date().toTimeString().split(' ')[0].substring(0, 5);
        
        // Set default dates for any date inputs
        const dateInputs = document.querySelectorAll('input[type="date"]');
        dateInputs.forEach(input => {
            if (!input.value) {
                input.value = today;
            }
        });
    },

    // Load dashboard data
    loadDashboard() {
        console.log('Loading dashboard...');
        // Dashboard loading logic will be handled by updateDashboard
        this.updateDashboard();
        console.log('Dashboard loaded');
    },

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" style="background: none; border: none; color: inherit; cursor: pointer; float: right;">&times;</button>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
        
        console.log(`Notification shown: ${message} (${type})`);
    },

    // Modal management
    async showModal(modalId) {
        console.log('Showing modal:', modalId);
        console.log('ComponentLoader available:', typeof ComponentLoader !== 'undefined');
        
        // If ComponentLoader is available, try to load the modal first
        if (typeof ComponentLoader !== 'undefined') {
            console.log('Loading modal with ComponentLoader...');
            await ComponentLoader.loadModal(modalId);
        }
        
        const modal = document.getElementById(modalId);
        console.log('Modal element found:', modal !== null);
        if (modal) {
            // Remove hidden class and set display
            modal.classList.remove('hidden');
            modal.style.display = 'flex';
            console.log('Modal display set to flex and hidden class removed');
            // Focus first input if available
            const firstInput = modal.querySelector('input:not([type="hidden"]), textarea, select');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        } else {
            console.error('Modal not found:', modalId);
            console.log('Available modal elements:', Array.from(document.querySelectorAll('[id*="modal"], [id*="form"]')).map(el => el.id));
        }
    },

    hideModal(modalId = null) {
        if (modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'none';
                modal.classList.add('hidden');
            }
        } else {
            // Hide all modals
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                modal.style.display = 'none';
                modal.classList.add('hidden');
            });
        }
        console.log('Modal hidden:', modalId || 'all');
    },

    // Open guide (delegates to FinancialGuides module)
    async openGuide(guideId) {
        console.log('Opening guide:', guideId);
        // Check if FinancialGuides module is available
        if (typeof FinancialGuides !== 'undefined' && FinancialGuides.openGuide) {
            await FinancialGuides.openGuide(guideId);
        } else {
            console.error('FinancialGuides module not available or openGuide method missing');
            // Fallback: show guides section if guide module isn't loaded
            this.showSection('guides');
        }
    },

    // Open calculator (delegates to FinancialCalculators module)
    openCalculator(calculatorType) {
        console.log('Opening calculator:', calculatorType);
        // Check if FinancialCalculators module is available
        if (typeof FinancialCalculators !== 'undefined' && FinancialCalculators.openCalculator) {
            FinancialCalculators.openCalculator(calculatorType);
        } else {
            console.error('FinancialCalculators module not available or openCalculator method missing');
            // Fallback: show calculators section if calculator module isn't loaded
            this.showSection('calculators');
        }
    },

    // Clear calculator results (delegates to FinancialCalculators module)
    clearCalculatorResults() {
        console.log('Clearing calculator results');
        if (typeof FinancialCalculators !== 'undefined' && FinancialCalculators.clearCalculatorResults) {
            FinancialCalculators.clearCalculatorResults();
        } else {
            // Fallback: hide results section manually
            const resultsSection = document.getElementById('calculator-results');
            if (resultsSection) {
                resultsSection.classList.remove('active');
                resultsSection.style.display = 'none';
            }
        }
    },

    // Dashboard update functions
    updateDashboard() {
        console.log('Updating dashboard...');
        // Basic dashboard updates - detailed logic can be added here
    },

    // Display functions for different sections
    displayExpenses() {
        console.log('Displaying expenses...');
        // Expense display logic
    },

    displayBudget() {
        console.log('Displaying budget...');
        // Budget display logic
    },

    displayIncome() {
        console.log('Displaying income...');
        // Income display logic
    },

    displayGoals() {
        console.log('Displaying goals...');
        // Goals display logic
    },

    updatePettyCashDisplay() {
        console.log('Updating petty cash display...');
        // Petty cash display logic
    },

    // Form handling methods
    addExpense(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        
        const expense = {
            id: this.generateId(),
            category: formData.get('category'),
            description: formData.get('description'),
            amount: parseFloat(formData.get('amount')),
            date: formData.get('date'),
            timestamp: new Date().toISOString()
        };
        
        // Save to localStorage
        const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
        expenses.push(expense);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        
        console.log('Expense added:', expense);
        
        // Close modal and reset form
        this.hideModal('expense-form');
        form.reset();
        
        this.showNotification('Expense added successfully!', 'success');
    },

    addIncome(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        
        const income = {
            id: this.generateId(),
            source: formData.get('source'),
            description: formData.get('description'),
            amount: parseFloat(formData.get('amount')),
            date: formData.get('date'),
            recurring: formData.get('recurring') === 'on',
            timestamp: new Date().toISOString()
        };
        
        // Save to localStorage
        const incomes = JSON.parse(localStorage.getItem('incomes') || '[]');
        incomes.push(income);
        localStorage.setItem('incomes', JSON.stringify(incomes));
        
        console.log('Income added:', income);
        
        // Close modal and reset form
        this.hideModal('income-form');
        form.reset();
        
        this.showNotification('Income added successfully!', 'success');
    },

    setBudget(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        
        const budget = {
            id: this.generateId(),
            category: formData.get('category'),
            amount: parseFloat(formData.get('amount')),
            period: formData.get('period'),
            timestamp: new Date().toISOString()
        };
        
        // Save to localStorage
        const budgets = JSON.parse(localStorage.getItem('budgets') || '[]');
        
        // Check if budget for this category already exists
        const existingIndex = budgets.findIndex(b => b.category === budget.category);
        if (existingIndex !== -1) {
            budgets[existingIndex] = budget;
        } else {
            budgets.push(budget);
        }
        
        localStorage.setItem('budgets', JSON.stringify(budgets));
        
        console.log('Budget set:', budget);
        
        // Close modal and reset form
        this.hideModal('budget-form');
        form.reset();
        
        this.showNotification('Budget set successfully!', 'success');
    },

    // Add petty cash transaction
    addPettyCash(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        
        const transaction = {
            id: this.generateId(),
            type: formData.get('type'),
            description: formData.get('description'),
            amount: parseFloat(formData.get('amount')),
            date: formData.get('date'),
            timestamp: new Date().toISOString()
        };
        
        // Save to localStorage
        const pettyCash = JSON.parse(localStorage.getItem('pettyCash') || '[]');
        pettyCash.push(transaction);
        localStorage.setItem('pettyCash', JSON.stringify(pettyCash));
        
        console.log('Petty cash transaction added:', transaction);
        
        // Close modal and reset form
        this.hideModal('petty-cash-form');
        form.reset();
        
        this.showNotification('Petty cash transaction added successfully!', 'success');
    },

    // Set financial goal
    setGoal(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        
        const goal = {
            id: this.generateId(),
            title: formData.get('title'),
            targetAmount: parseFloat(formData.get('target-amount')),
            currentAmount: parseFloat(formData.get('current-amount') || 0),
            targetDate: formData.get('target-date'),
            category: formData.get('category'),
            description: formData.get('description'),
            timestamp: new Date().toISOString()
        };
        
        // Save to localStorage
        const goals = JSON.parse(localStorage.getItem('goals') || '[]');
        goals.push(goal);
        localStorage.setItem('goals', JSON.stringify(goals));
        
        console.log('Goal set:', goal);
        
        // Close modal and reset form
        this.hideModal('goal-form');
        form.reset();
        
        this.showNotification('Financial goal set successfully!', 'success');
    },

    // Data management methods
    getData(key) {
        return JSON.parse(localStorage.getItem(key) || '[]');
    },

    saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
        console.log(`Data saved for ${key}:`, data.length, 'items');
    },

    clearAllData() {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            localStorage.clear();
            this.showNotification('All data cleared successfully!', 'success');
            console.log('All data cleared');
        }
    },

    // Export data
    exportData() {
        const data = {
            expenses: this.getData('expenses'),
            incomes: this.getData('incomes'),
            budgets: this.getData('budgets'),
            goals: this.getData('goals'),
            pettyCash: this.getData('pettyCash'),
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `finfree-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Data exported successfully!', 'success');
        console.log('Data exported');
    }
};

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing FinFree...');
    FinFree.init();
});

// Make FinFree globally available
window.FinFree = FinFree;