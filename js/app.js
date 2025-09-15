// FinFree - Main Application JavaScript

// Main app object to hold all functionality
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
        console.log('FinFree initializing...');
        this.loadData();
        this.bindEvents();
        this.showSection('dashboard');
        this.updateDashboard();
        this.setCurrentDate();
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

    // Bind event listeners
    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.showSection(section);
                this.updateNavigation(link);
            });
        });

        // Mobile navigation toggle
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    },

    // Show specific section
    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Update specific section content
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
        
        // Set default dates
        const dateInputs = document.querySelectorAll('input[type="date"]');
        dateInputs.forEach(input => {
            if (!input.value) {
                input.value = today;
            }
        });

        // Set default time for petty cash
        const timeInput = document.getElementById('petty-time');
        if (timeInput && !timeInput.value) {
            timeInput.value = currentTime;
        }
    },

    // Update dashboard with latest data
    updateDashboard() {
        this.updateStats();
        this.updateRecentTransactions();
        this.updateBudgetOverview();
        this.updateGoalsProgress();
    },

    // Update dashboard statistics
    updateStats() {
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
        
        // Calculate total balance (income - expenses)
        const totalIncome = this.data.income.reduce((sum, item) => sum + item.amount, 0);
        const totalExpenses = this.data.expenses.reduce((sum, item) => sum + item.amount, 0);
        const totalBalance = totalIncome - totalExpenses;

        // Calculate monthly income and expenses
        const monthlyIncome = this.data.income
            .filter(item => item.date.startsWith(currentMonth))
            .reduce((sum, item) => sum + item.amount, 0);

        const monthlyExpenses = this.data.expenses
            .filter(item => item.date.startsWith(currentMonth))
            .reduce((sum, item) => sum + item.amount, 0);

        // Calculate emergency fund (goals with category 'emergency')
        const emergencyFund = this.data.goals
            .filter(goal => goal.category === 'emergency')
            .reduce((sum, goal) => sum + goal.current, 0);

        // Update DOM elements
        this.updateElement('total-balance', this.formatCurrency(totalBalance));
        this.updateElement('monthly-income', this.formatCurrency(monthlyIncome));
        this.updateElement('monthly-expenses', this.formatCurrency(monthlyExpenses));
        this.updateElement('emergency-fund', this.formatCurrency(emergencyFund));
    },

    // Update recent transactions display
    updateRecentTransactions() {
        const container = document.getElementById('recent-transactions');
        if (!container) return;

        // Combine expenses and income, sort by date
        const allTransactions = [
            ...this.data.expenses.map(item => ({ ...item, type: 'expense' })),
            ...this.data.income.map(item => ({ ...item, type: 'income' }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

        if (allTransactions.length === 0) {
            container.innerHTML = '<p class="text-center text-secondary">No transactions yet</p>';
            return;
        }

        container.innerHTML = allTransactions.map(transaction => `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-description">${transaction.description}</div>
                    <div class="transaction-category">${transaction.category || transaction.source}</div>
                </div>
                <div class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'expense' ? '-' : '+'}${this.formatCurrency(transaction.amount)}
                </div>
            </div>
        `).join('');
    },

    // Update budget overview on dashboard
    updateBudgetOverview() {
        const container = document.getElementById('budget-overview');
        if (!container) return;

        const currentMonth = new Date().toISOString().slice(0, 7);
        const budget = this.data.budgets[currentMonth];

        if (!budget) {
            container.innerHTML = '<p class="text-center text-secondary">No budget set for this month</p>';
            return;
        }

        const categories = Object.keys(budget).filter(key => key !== 'month');
        const budgetHtml = categories.map(category => {
            const budgeted = budget[category] || 0;
            const spent = this.data.expenses
                .filter(expense => expense.date.startsWith(currentMonth) && expense.category === category)
                .reduce((sum, expense) => sum + expense.amount, 0);
            
            const isOverBudget = spent > budgeted;
            
            return `
                <div class="budget-category">
                    <div class="category-name">${this.formatCategoryName(category)}</div>
                    <div class="category-amounts">
                        <span class="budgeted">${this.formatCurrency(budgeted)}</span>
                        <span class="spent ${isOverBudget ? 'over-budget' : 'under-budget'}">
                            ${this.formatCurrency(spent)}
                        </span>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = budgetHtml;
    },

    // Update goals progress on dashboard
    updateGoalsProgress() {
        const container = document.getElementById('goals-progress');
        if (!container) return;

        const activeGoals = this.data.goals
            .filter(goal => goal.current < goal.target)
            .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
            .slice(0, 3);

        if (activeGoals.length === 0) {
            container.innerHTML = '<p class="text-center text-secondary">No active goals</p>';
            return;
        }

        container.innerHTML = activeGoals.map(goal => {
            const progress = (goal.current / goal.target) * 100;
            const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
            
            return `
                <div class="goal-card">
                    <div class="goal-header">
                        <div class="goal-name">${goal.name}</div>
                        <div class="goal-category">${this.formatCategoryName(goal.category)}</div>
                    </div>
                    <div class="goal-progress">
                        <div class="goal-amounts">
                            <span>${this.formatCurrency(goal.current)}</span>
                            <span>${this.formatCurrency(goal.target)}</span>
                        </div>
                        <div class="goal-bar">
                            <div class="goal-fill" style="width: ${Math.min(progress, 100)}%"></div>
                        </div>
                    </div>
                    <div class="goal-deadline">
                        ${daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                    </div>
                </div>
            `;
        }).join('');
    },

    // Display expenses list
    displayExpenses() {
        const container = document.getElementById('expenses-list');
        if (!container) return;

        // Apply filters
        const categoryFilter = document.getElementById('filter-category')?.value || '';
        const monthFilter = document.getElementById('filter-month')?.value || '';

        let filteredExpenses = [...this.data.expenses];

        if (categoryFilter) {
            filteredExpenses = filteredExpenses.filter(expense => expense.category === categoryFilter);
        }

        if (monthFilter) {
            filteredExpenses = filteredExpenses.filter(expense => expense.date.startsWith(monthFilter));
        }

        // Sort by date (newest first)
        filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));

        if (filteredExpenses.length === 0) {
            container.innerHTML = '<p class="text-center text-secondary">No expenses found</p>';
            return;
        }

        container.innerHTML = filteredExpenses.map(expense => `
            <div class="list-item">
                <div class="item-info">
                    <div class="item-title">${expense.description}</div>
                    <div class="item-details">
                        ${this.formatCategoryName(expense.category)} • ${this.formatDate(expense.date)}
                    </div>
                </div>
                <div class="item-amount expense">${this.formatCurrency(expense.amount)}</div>
            </div>
        `).join('');
    },

    // Display income list
    displayIncome() {
        const container = document.getElementById('income-list');
        if (!container) return;

        const sortedIncome = [...this.data.income].sort((a, b) => new Date(b.date) - new Date(a.date));

        if (sortedIncome.length === 0) {
            container.innerHTML = '<p class="text-center text-secondary">No income recorded yet</p>';
            return;
        }

        container.innerHTML = sortedIncome.map(income => `
            <div class="list-item">
                <div class="item-info">
                    <div class="item-title">${income.description}</div>
                    <div class="item-details">
                        ${this.formatCategoryName(income.source)} • ${this.formatDate(income.date)}
                        ${income.recurring ? ' • Recurring' : ''}
                    </div>
                </div>
                <div class="item-amount income">+${this.formatCurrency(income.amount)}</div>
            </div>
        `).join('');
    },

    // Display goals list
    displayGoals() {
        const container = document.getElementById('goals-list');
        if (!container) return;

        if (this.data.goals.length === 0) {
            container.innerHTML = '<p class="text-center text-secondary">No goals created yet</p>';
            return;
        }

        container.innerHTML = this.data.goals.map(goal => {
            const progress = (goal.current / goal.target) * 100;
            const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
            
            return `
                <div class="goal-card">
                    <div class="goal-header">
                        <div class="goal-name">${goal.name}</div>
                        <div class="goal-category">${this.formatCategoryName(goal.category)}</div>
                    </div>
                    <div class="goal-progress">
                        <div class="goal-amounts">
                            <span>${this.formatCurrency(goal.current)}</span>
                            <span>${this.formatCurrency(goal.target)}</span>
                        </div>
                        <div class="goal-bar">
                            <div class="goal-fill" style="width: ${Math.min(progress, 100)}%"></div>
                        </div>
                    </div>
                    <div class="goal-deadline">
                        Target: ${this.formatDate(goal.deadline)} 
                        (${daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'})
                    </div>
                </div>
            `;
        }).join('');
    },

    // Display budget
    displayBudget() {
        const container = document.getElementById('budget-display');
        if (!container) return;

        // Show current month's budget by default
        const currentMonth = new Date().toISOString().slice(0, 7);
        const budget = this.data.budgets[currentMonth];

        if (!budget) {
            container.innerHTML = '<p class="text-center text-secondary">No budget created for this month</p>';
            return;
        }

        const categories = Object.keys(budget).filter(key => key !== 'month');
        const budgetHtml = `
            <div class="budget-month">${this.formatMonthYear(currentMonth)}</div>
            <div class="budget-overview">
                ${categories.map(category => {
                    const budgeted = budget[category] || 0;
                    const spent = this.data.expenses
                        .filter(expense => expense.date.startsWith(currentMonth) && expense.category === category)
                        .reduce((sum, expense) => sum + expense.amount, 0);
                    
                    const remaining = budgeted - spent;
                    const isOverBudget = spent > budgeted;
                    
                    return `
                        <div class="budget-category">
                            <div class="category-name">${this.formatCategoryName(category)}</div>
                            <div class="category-amounts">
                                <span class="budgeted">Budget: ${this.formatCurrency(budgeted)}</span>
                                <span class="spent ${isOverBudget ? 'over-budget' : 'under-budget'}">
                                    Spent: ${this.formatCurrency(spent)}
                                </span>
                                <span class="${remaining >= 0 ? 'text-success' : 'text-error'}">
                                    ${remaining >= 0 ? 'Remaining' : 'Over'}: ${this.formatCurrency(Math.abs(remaining))}
                                </span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        container.innerHTML = budgetHtml;
    },

    // Update petty cash display
    updatePettyCashDisplay() {
        this.updatePettyCashSummary();
        this.displayPettyCashList();
    },

    // Update petty cash summary
    updatePettyCashSummary() {
        const today = new Date().toISOString().split('T')[0];
        const todayExpenses = this.data.pettyCash
            .filter(item => item.date === today)
            .reduce((sum, item) => sum + item.amount, 0);
        
        const dailyLimit = this.data.settings.dailyLimit;
        const remaining = Math.max(0, dailyLimit - todayExpenses);
        const progressPercent = Math.min((todayExpenses / dailyLimit) * 100, 100);

        this.updateElement('today-spent', this.formatCurrency(todayExpenses));
        this.updateElement('today-remaining', this.formatCurrency(remaining));
        
        const progressFill = document.getElementById('spending-fill');
        if (progressFill) {
            progressFill.style.width = `${progressPercent}%`;
        }
    },

    // Display petty cash list
    displayPettyCashList() {
        const container = document.getElementById('petty-cash-list');
        if (!container) return;

        // Group by date
        const groupedExpenses = {};
        this.data.pettyCash.forEach(expense => {
            if (!groupedExpenses[expense.date]) {
                groupedExpenses[expense.date] = [];
            }
            groupedExpenses[expense.date].push(expense);
        });

        // Sort dates (newest first)
        const sortedDates = Object.keys(groupedExpenses).sort((a, b) => new Date(b) - new Date(a));

        if (sortedDates.length === 0) {
            container.innerHTML = '<p class="text-center text-secondary">No petty cash expenses recorded</p>';
            return;
        }

        container.innerHTML = sortedDates.map(date => {
            const expenses = groupedExpenses[date].sort((a, b) => a.time.localeCompare(b.time));
            const dailyTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);

            return `
                <div class="petty-cash-day">
                    <h4 class="date-header">${this.formatDate(date)} - Total: ${this.formatCurrency(dailyTotal)}</h4>
                    ${expenses.map(expense => `
                        <div class="list-item">
                            <div class="item-info">
                                <div class="item-title">${expense.description}</div>
                                <div class="item-details">${expense.time}</div>
                            </div>
                            <div class="item-amount expense">${this.formatCurrency(expense.amount)}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        }).join('');
    },

    // Utility function to update element content
    updateElement(id, content) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
        }
    },

    // Format currency
    formatCurrency(amount) {
        return `${this.data.settings.currency}${Math.abs(amount).toFixed(2)}`;
    },

    // Format date
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    // Format month year
    formatMonthYear(monthString) {
        return new Date(monthString + '-01').toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        });
    },

    // Format category name
    formatCategoryName(category) {
        return category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');
    },

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};

// Modal utility functions
const Modal = {
    show(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            // Focus on first input
            const firstInput = modal.querySelector('input, select, textarea');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    },

    hide(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            // Reset form if exists
            const form = modal.querySelector('form');
            if (form) {
                form.reset();
                FinFree.setCurrentDate(); // Reset dates to current
            }
        }
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    FinFree.init();
});

// Make FinFree and Modal available globally
window.FinFree = FinFree;
window.Modal = Modal;