// FinFree - Petty Cash Tracker Module

// Petty Cash management functionality
const PettyCashManager = {
    // Initialize petty cash tracking
    init() {
        this.bindEvents();
        this.initializeDailyLimit();
        this.updateDisplay();
    },

    // Bind event listeners for petty cash functionality
    bindEvents() {
        // Add petty cash expense button
        const addPettyExpenseBtn = document.getElementById('add-petty-expense-btn');
        if (addPettyExpenseBtn) {
            addPettyExpenseBtn.addEventListener('click', () => {
                Modal.show('petty-cash-form');
            });
        }

        // Close petty cash form
        const closePettyForm = document.getElementById('close-petty-form');
        const cancelPetty = document.getElementById('cancel-petty');
        
        if (closePettyForm) {
            closePettyForm.addEventListener('click', () => {
                Modal.hide('petty-cash-form');
            });
        }

        if (cancelPetty) {
            cancelPetty.addEventListener('click', () => {
                Modal.hide('petty-cash-form');
            });
        }

        // Add petty cash form submission
        const addPettyForm = document.getElementById('add-petty-form');
        if (addPettyForm) {
            addPettyForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addPettyExpense();
            });
        }

        // Close modal when clicking outside
        const pettyModal = document.getElementById('petty-cash-form');
        if (pettyModal) {
            pettyModal.addEventListener('click', (e) => {
                if (e.target === pettyModal) {
                    Modal.hide('petty-cash-form');
                }
            });
        }

        // Daily limit input
        const dailyLimitInput = document.getElementById('daily-limit');
        if (dailyLimitInput) {
            dailyLimitInput.addEventListener('change', () => {
                this.updateDailyLimit();
            });
        }
    },

    // Initialize daily limit from settings
    initializeDailyLimit() {
        const dailyLimitInput = document.getElementById('daily-limit');
        if (dailyLimitInput && FinFree.data.settings.dailyLimit) {
            dailyLimitInput.value = FinFree.data.settings.dailyLimit;
        }
    },

    // Update daily limit
    updateDailyLimit() {
        const limit = parseFloat(document.getElementById('daily-limit').value);
        
        if (!limit || limit <= 0) {
            this.showError('Please enter a valid daily limit');
            return;
        }

        FinFree.data.settings.dailyLimit = limit;
        FinFree.saveData();
        this.updateDisplay();
        this.showSuccess('Daily limit updated successfully!');
    },

    // Add new petty cash expense
    addPettyExpense() {
        const amount = parseFloat(document.getElementById('petty-amount').value);
        const description = document.getElementById('petty-description').value.trim();
        const time = document.getElementById('petty-time').value;
        const date = new Date().toISOString().split('T')[0]; // Today's date

        // Validation
        if (!amount || amount <= 0) {
            this.showError('Please enter a valid amount');
            return;
        }

        if (!description) {
            this.showError('Please enter a description');
            return;
        }

        if (!time) {
            this.showError('Please select a time');
            return;
        }

        // Check if adding this expense would exceed daily limit
        const todaySpent = this.getTodaySpent();
        const dailyLimit = FinFree.data.settings.dailyLimit;
        
        if (todaySpent + amount > dailyLimit) {
            const overAmount = (todaySpent + amount) - dailyLimit;
            if (!confirm(`This expense will put you ${FinFree.formatCurrency(overAmount)} over your daily limit. Do you want to continue?`)) {
                return;
            }
        }

        // Create petty cash expense object
        const expense = {
            id: FinFree.generateId(),
            amount: amount,
            description: description,
            time: time,
            date: date,
            timestamp: new Date().toISOString()
        };

        // Add to data
        FinFree.data.pettyCash.push(expense);
        FinFree.saveData();

        // Update UI
        this.updateDisplay();
        FinFree.updateDashboard();

        // Close modal and show success
        Modal.hide('petty-cash-form');
        this.showSuccess(`Petty cash expense of ${FinFree.formatCurrency(amount)} added successfully!`);

        // Check for spending alerts
        this.checkSpendingAlerts();
    },

    // Delete petty cash expense
    deletePettyExpense(expenseId) {
        if (confirm('Are you sure you want to delete this petty cash expense?')) {
            FinFree.data.pettyCash = FinFree.data.pettyCash.filter(expense => expense.id !== expenseId);
            FinFree.saveData();
            this.updateDisplay();
            FinFree.updateDashboard();
            this.showSuccess('Petty cash expense deleted successfully!');
        }
    },

    // Get today's total spending
    getTodaySpent() {
        const today = new Date().toISOString().split('T')[0];
        return FinFree.data.pettyCash
            .filter(expense => expense.date === today)
            .reduce((total, expense) => total + expense.amount, 0);
    },

    // Get spending for a specific date
    getDateSpent(date) {
        return FinFree.data.pettyCash
            .filter(expense => expense.date === date)
            .reduce((total, expense) => total + expense.amount, 0);
    },

    // Update display elements
    updateDisplay() {
        this.updateSummary();
        this.displayPettyCashList();
    },

    // Update today's spending summary
    updateSummary() {
        const todaySpent = this.getTodaySpent();
        const dailyLimit = FinFree.data.settings.dailyLimit;
        const remaining = Math.max(0, dailyLimit - todaySpent);
        const progressPercent = Math.min((todaySpent / dailyLimit) * 100, 100);

        // Update DOM elements
        this.updateElement('today-spent', FinFree.formatCurrency(todaySpent));
        this.updateElement('today-remaining', FinFree.formatCurrency(remaining));
        
        // Update progress bar
        const progressFill = document.getElementById('spending-fill');
        if (progressFill) {
            progressFill.style.width = `${progressPercent}%`;
            
            // Change color based on spending level
            if (progressPercent <= 50) {
                progressFill.style.background = 'var(--success-color)';
            } else if (progressPercent <= 80) {
                progressFill.style.background = 'var(--warning-color)';
            } else {
                progressFill.style.background = 'var(--error-color)';
            }
        }

        // Update remaining amount color
        const remainingElement = document.getElementById('today-remaining');
        if (remainingElement) {
            if (remaining === 0 && todaySpent > dailyLimit) {
                remainingElement.style.color = 'var(--error-color)';
                remainingElement.textContent = `Over by ${FinFree.formatCurrency(todaySpent - dailyLimit)}`;
            } else {
                remainingElement.style.color = remaining > dailyLimit * 0.5 ? 'var(--success-color)' : 'var(--warning-color)';
                remainingElement.textContent = FinFree.formatCurrency(remaining);
            }
        }
    },

    // Display petty cash list
    displayPettyCashList() {
        const container = document.getElementById('petty-cash-list');
        if (!container) return;

        // Group expenses by date
        const groupedExpenses = this.groupExpensesByDate();
        const sortedDates = Object.keys(groupedExpenses).sort((a, b) => new Date(b) - new Date(a));

        if (sortedDates.length === 0) {
            container.innerHTML = '<p class="text-center text-secondary">No petty cash expenses recorded yet</p>';
            return;
        }

        const html = sortedDates.map(date => {
            const expenses = groupedExpenses[date].sort((a, b) => a.time.localeCompare(b.time));
            const dailyTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);
            const isToday = date === new Date().toISOString().split('T')[0];
            const dailyLimit = FinFree.data.settings.dailyLimit;
            const isOverLimit = dailyTotal > dailyLimit;

            return `
                <div class="petty-cash-day ${isToday ? 'today' : ''}">
                    <div class="date-header ${isOverLimit ? 'over-limit' : ''}">
                        <h4>${this.formatDateHeader(date)} ${isToday ? '(Today)' : ''}</h4>
                        <div class="daily-summary">
                            <span class="daily-total ${isOverLimit ? 'over-limit' : ''}">${FinFree.formatCurrency(dailyTotal)}</span>
                            <span class="daily-limit">/ ${FinFree.formatCurrency(dailyLimit)}</span>
                        </div>
                    </div>
                    <div class="expenses-list">
                        ${expenses.map(expense => `
                            <div class="list-item petty-expense">
                                <div class="item-info">
                                    <div class="item-title">${expense.description}</div>
                                    <div class="item-details">${this.formatTime(expense.time)}</div>
                                </div>
                                <div class="item-amount expense">${FinFree.formatCurrency(expense.amount)}</div>
                                <button class="delete-btn" onclick="PettyCashManager.deletePettyExpense('${expense.id}')" title="Delete expense">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
    },

    // Group expenses by date
    groupExpensesByDate() {
        const grouped = {};
        FinFree.data.pettyCash.forEach(expense => {
            if (!grouped[expense.date]) {
                grouped[expense.date] = [];
            }
            grouped[expense.date].push(expense);
        });
        return grouped;
    },

    // Format date header
    formatDateHeader(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (dateString === today.toISOString().split('T')[0]) {
            return 'Today';
        } else if (dateString === yesterday.toISOString().split('T')[0]) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
            });
        }
    },

    // Format time
    formatTime(timeString) {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    },

    // Check for spending alerts
    checkSpendingAlerts() {
        const todaySpent = this.getTodaySpent();
        const dailyLimit = FinFree.data.settings.dailyLimit;
        const percentage = (todaySpent / dailyLimit) * 100;

        if (percentage >= 100) {
            this.showSpendingAlert('limit-exceeded', `You've exceeded your daily limit by ${FinFree.formatCurrency(todaySpent - dailyLimit)}!`);
        } else if (percentage >= 80) {
            this.showSpendingAlert('warning', `You've used ${Math.round(percentage)}% of your daily limit. ${FinFree.formatCurrency(dailyLimit - todaySpent)} remaining.`);
        }
    },

    // Show spending alert
    showSpendingAlert(type, message) {
        const alertContainer = document.createElement('div');
        alertContainer.className = `spending-alert ${type}`;
        alertContainer.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            background: ${type === 'limit-exceeded' ? 'var(--error-color)' : 'var(--warning-color)'};
            color: white;
            padding: 1rem;
            border-radius: var(--border-radius);
            z-index: 3000;
            max-width: 300px;
            box-shadow: var(--shadow-lg);
            animation: slideIn 0.3s ease;
        `;

        alertContainer.innerHTML = `
            <h5 style="margin: 0 0 0.5rem 0;">💸 Spending Alert</h5>
            <p style="margin: 0; font-size: 0.9rem;">${message}</p>
            <button onclick="this.parentElement.remove()" style="
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 0.5rem;
                font-size: 0.8rem;
            ">OK</button>
        `;

        document.body.appendChild(alertContainer);

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            if (alertContainer.parentElement) {
                alertContainer.remove();
            }
        }, 5000);
    },

    // Get spending statistics
    getSpendingStats(days = 7) {
        const today = new Date();
        const stats = {
            totalDays: days,
            totalSpent: 0,
            averageDaily: 0,
            daysOverLimit: 0,
            highestDay: { date: '', amount: 0 },
            lowestDay: { date: '', amount: Infinity },
            dailyBreakdown: []
        };

        for (let i = 0; i < days; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            const dailySpent = this.getDateSpent(dateString);
            const dailyLimit = FinFree.data.settings.dailyLimit;

            stats.totalSpent += dailySpent;
            
            if (dailySpent > dailyLimit) {
                stats.daysOverLimit++;
            }

            if (dailySpent > stats.highestDay.amount) {
                stats.highestDay = { date: dateString, amount: dailySpent };
            }

            if (dailySpent < stats.lowestDay.amount && dailySpent > 0) {
                stats.lowestDay = { date: dateString, amount: dailySpent };
            }

            stats.dailyBreakdown.push({
                date: dateString,
                amount: dailySpent,
                percentage: dailyLimit > 0 ? (dailySpent / dailyLimit) * 100 : 0,
                overLimit: dailySpent > dailyLimit
            });
        }

        stats.averageDaily = stats.totalSpent / days;
        
        return stats;
    },

    // Export petty cash data
    exportData(days = 30) {
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - days);

        const filteredExpenses = FinFree.data.pettyCash.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= startDate;
        });

        if (filteredExpenses.length === 0) {
            this.showError('No petty cash data to export');
            return;
        }

        const headers = ['Date', 'Time', 'Description', 'Amount'];
        const csvContent = [
            headers.join(','),
            ...filteredExpenses.map(expense => [
                expense.date,
                expense.time,
                `"${expense.description}"`,
                expense.amount
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `petty_cash_${days}_days.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        this.showSuccess('Petty cash data exported successfully!');
    },

    // Utility function to update element content
    updateElement(id, content) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
        }
    },

    // Show success message
    showSuccess(message) {
        ExpenseManager.showSuccess(message);
    },

    // Show error message
    showError(message) {
        ExpenseManager.showError(message);
    }
};

// Global function for updating daily limit
function updateDailyLimit() {
    PettyCashManager.updateDailyLimit();
}

// Add custom CSS for petty cash
const pettyCashStyles = document.createElement('style');
pettyCashStyles.textContent = `
    .petty-cash-day {
        margin-bottom: 1.5rem;
        background: var(--surface-color);
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow-md);
        overflow: hidden;
    }

    .petty-cash-day.today {
        border: 2px solid var(--primary-color);
    }

    .date-header {
        padding: 1rem;
        background: var(--bg-color);
        border-bottom: 1px solid var(--border-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .date-header.over-limit {
        background: rgba(220, 38, 38, 0.1);
        border-bottom-color: var(--error-color);
    }

    .date-header h4 {
        margin: 0;
        color: var(--text-primary);
        font-size: 1.1rem;
    }

    .daily-summary {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        font-weight: 600;
    }

    .daily-total {
        color: var(--text-primary);
        font-size: 1.1rem;
    }

    .daily-total.over-limit {
        color: var(--error-color);
    }

    .daily-limit {
        color: var(--text-secondary);
        font-size: 0.9rem;
    }

    .petty-expense {
        position: relative;
    }

    .petty-expense:hover .delete-btn {
        opacity: 1;
    }

    .delete-btn {
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
        background: var(--error-color);
        color: white;
        border: none;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s ease;
        font-size: 0.8rem;
    }

    .delete-btn:hover {
        background: #dc2626;
    }

    .spending-alert {
        animation: slideIn 0.3s ease;
    }

    @media (max-width: 768px) {
        .date-header {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
        }

        .delete-btn {
            opacity: 1;
            right: 0.5rem;
            width: 28px;
            height: 28px;
        }

        .petty-expense {
            padding-right: 3rem;
        }
    }
`;
document.head.appendChild(pettyCashStyles);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    PettyCashManager.init();
});

// Make PettyCashManager and functions available globally
window.PettyCashManager = PettyCashManager;
window.updateDailyLimit = updateDailyLimit;