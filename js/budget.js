// FinFree - Budget Management Module

// Budget management functionality
const BudgetManager = {
    // Initialize budget management
    init() {
        this.bindEvents();
    },

    // Bind event listeners for budget functionality
    bindEvents() {
        // Create budget button
        const createBudgetBtn = document.getElementById('create-budget-btn');
        if (createBudgetBtn) {
            createBudgetBtn.addEventListener('click', () => {
                this.initializeBudgetForm();
                Modal.show('budget-form');
            });
        }

        // Close budget form
        const closeBudgetForm = document.getElementById('close-budget-form');
        const cancelBudget = document.getElementById('cancel-budget');
        
        if (closeBudgetForm) {
            closeBudgetForm.addEventListener('click', () => {
                Modal.hide('budget-form');
            });
        }

        if (cancelBudget) {
            cancelBudget.addEventListener('click', () => {
                Modal.hide('budget-form');
            });
        }

        // Add budget form submission
        const addBudgetForm = document.getElementById('add-budget-form');
        if (addBudgetForm) {
            addBudgetForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createBudget();
            });
        }

        // Close modal when clicking outside
        const budgetModal = document.getElementById('budget-form');
        if (budgetModal) {
            budgetModal.addEventListener('click', (e) => {
                if (e.target === budgetModal) {
                    Modal.hide('budget-form');
                }
            });
        }
    },

    // Initialize budget form with current month and suggested amounts
    initializeBudgetForm() {
        const currentMonth = new Date().toISOString().slice(0, 7);
        const monthInput = document.getElementById('budget-month');
        
        if (monthInput) {
            monthInput.value = currentMonth;
        }

        // Pre-fill with previous month's budget if available
        const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7);
        const lastMonthBudget = FinFree.data.budgets[lastMonth];
        
        if (lastMonthBudget) {
            this.prefillBudgetForm(lastMonthBudget);
        } else {
            // Use spending patterns to suggest budget amounts
            this.suggestBudgetAmounts();
        }
    },

    // Pre-fill budget form with previous data
    prefillBudgetForm(budgetData) {
        const categories = ['food', 'transportation', 'shopping', 'entertainment', 'bills', 'healthcare', 'education', 'other'];
        
        categories.forEach(category => {
            const input = document.getElementById(`budget-${category}`);
            if (input && budgetData[category]) {
                input.value = budgetData[category];
            }
        });
    },

    // Suggest budget amounts based on historical spending
    suggestBudgetAmounts() {
        const categories = ['food', 'transportation', 'shopping', 'entertainment', 'bills', 'healthcare', 'education', 'other'];
        const last3Months = this.getLast3MonthsAverage();
        
        categories.forEach(category => {
            const input = document.getElementById(`budget-${category}`);
            if (input && last3Months[category]) {
                // Suggest 10% more than average spending
                const suggestedAmount = Math.ceil(last3Months[category] * 1.1);
                input.placeholder = `Suggested: $${suggestedAmount}`;
            }
        });
    },

    // Calculate average spending for last 3 months by category
    getLast3MonthsAverage() {
        const now = new Date();
        const averages = {};
        const categories = ['food', 'transportation', 'shopping', 'entertainment', 'bills', 'healthcare', 'education', 'other'];
        
        categories.forEach(category => {
            let totalSpent = 0;
            let monthCount = 0;
            
            for (let i = 0; i < 3; i++) {
                const month = new Date(now.getFullYear(), now.getMonth() - i, 1).toISOString().slice(0, 7);
                const monthlySpent = ExpenseManager.calculateCategoryTotal(month, category);
                
                if (monthlySpent > 0) {
                    totalSpent += monthlySpent;
                    monthCount++;
                }
            }
            
            averages[category] = monthCount > 0 ? totalSpent / monthCount : 0;
        });
        
        return averages;
    },

    // Create new budget
    createBudget() {
        const month = document.getElementById('budget-month').value;
        
        if (!month) {
            this.showError('Please select a month');
            return;
        }

        // Check if budget already exists for this month
        if (FinFree.data.budgets[month]) {
            if (!confirm('A budget already exists for this month. Do you want to update it?')) {
                return;
            }
        }

        const categories = ['food', 'transportation', 'shopping', 'entertainment', 'bills', 'healthcare', 'education', 'other'];
        const budget = { month };
        let totalBudget = 0;

        categories.forEach(category => {
            const amount = parseFloat(document.getElementById(`budget-${category}`).value) || 0;
            budget[category] = amount;
            totalBudget += amount;
        });

        if (totalBudget === 0) {
            this.showError('Please enter at least one budget amount');
            return;
        }

        // Save budget
        FinFree.data.budgets[month] = budget;
        FinFree.saveData();

        // Update UI
        FinFree.displayBudget();
        FinFree.updateDashboard();

        // Close modal and show success
        Modal.hide('budget-form');
        this.showSuccess(`Budget for ${FinFree.formatMonthYear(month)} created successfully!`);
    },

    // Get budget vs actual comparison
    getBudgetComparison(month) {
        const budget = FinFree.data.budgets[month];
        if (!budget) return null;

        const categories = ['food', 'transportation', 'shopping', 'entertainment', 'bills', 'healthcare', 'education', 'other'];
        const comparison = {
            month,
            categories: {},
            totals: {
                budgeted: 0,
                spent: 0,
                remaining: 0
            }
        };

        categories.forEach(category => {
            const budgeted = budget[category] || 0;
            const spent = ExpenseManager.calculateCategoryTotal(month, category);
            const remaining = budgeted - spent;
            const percentSpent = budgeted > 0 ? (spent / budgeted) * 100 : 0;

            comparison.categories[category] = {
                budgeted,
                spent,
                remaining,
                percentSpent,
                isOverBudget: spent > budgeted,
                status: this.getBudgetStatus(percentSpent)
            };

            comparison.totals.budgeted += budgeted;
            comparison.totals.spent += spent;
        });

        comparison.totals.remaining = comparison.totals.budgeted - comparison.totals.spent;
        comparison.totals.percentSpent = comparison.totals.budgeted > 0 ? 
            (comparison.totals.spent / comparison.totals.budgeted) * 100 : 0;

        return comparison;
    },

    // Get budget status based on percentage spent
    getBudgetStatus(percentSpent) {
        if (percentSpent <= 50) return 'good';
        if (percentSpent <= 80) return 'warning';
        if (percentSpent <= 100) return 'caution';
        return 'over';
    },

    // Get budget insights and recommendations
    getBudgetInsights(month) {
        const comparison = this.getBudgetComparison(month);
        if (!comparison) return null;

        const insights = {
            summary: this.generateBudgetSummary(comparison),
            recommendations: this.generateRecommendations(comparison),
            alerts: this.generateBudgetAlerts(comparison)
        };

        return insights;
    },

    // Generate budget summary
    generateBudgetSummary(comparison) {
        const { totals } = comparison;
        const summary = {
            totalBudget: totals.budgeted,
            totalSpent: totals.spent,
            remaining: totals.remaining,
            percentSpent: totals.percentSpent,
            status: this.getBudgetStatus(totals.percentSpent)
        };

        return summary;
    },

    // Generate budget recommendations
    generateRecommendations(comparison) {
        const recommendations = [];
        const { categories, totals } = comparison;

        // Overall budget recommendations
        if (totals.percentSpent > 100) {
            recommendations.push({
                type: 'warning',
                category: 'overall',
                message: 'You\'ve exceeded your total budget. Consider reviewing your spending habits.',
                action: 'Review expenses and identify areas to cut back.'
            });
        } else if (totals.percentSpent < 50) {
            recommendations.push({
                type: 'success',
                category: 'overall',
                message: 'Great job staying within budget! Consider saving the extra money.',
                action: 'Move surplus to savings or emergency fund.'
            });
        }

        // Category-specific recommendations
        Object.entries(categories).forEach(([category, data]) => {
            if (data.isOverBudget) {
                recommendations.push({
                    type: 'error',
                    category,
                    message: `You're over budget in ${FinFree.formatCategoryName(category)} by ${FinFree.formatCurrency(Math.abs(data.remaining))}.`,
                    action: 'Reduce spending in this category or adjust budget allocation.'
                });
            } else if (data.percentSpent > 80) {
                recommendations.push({
                    type: 'warning',
                    category,
                    message: `You're close to your ${FinFree.formatCategoryName(category)} budget limit.`,
                    action: 'Monitor spending carefully for the rest of the month.'
                });
            }
        });

        return recommendations;
    },

    // Generate budget alerts
    generateBudgetAlerts(comparison) {
        const alerts = [];
        const { categories } = comparison;

        Object.entries(categories).forEach(([category, data]) => {
            if (data.percentSpent >= 90) {
                alerts.push({
                    type: data.isOverBudget ? 'critical' : 'warning',
                    category,
                    message: `${FinFree.formatCategoryName(category)}: ${Math.round(data.percentSpent)}% of budget used`,
                    remaining: data.remaining
                });
            }
        });

        return alerts;
    },

    // Generate budget report
    generateBudgetReport(month) {
        const comparison = this.getBudgetComparison(month);
        const insights = this.getBudgetInsights(month);
        
        if (!comparison || !insights) {
            return null;
        }

        const report = {
            month,
            monthName: FinFree.formatMonthYear(month),
            comparison,
            insights,
            generatedAt: new Date().toISOString()
        };

        return report;
    },

    // Export budget report as JSON
    exportBudgetReport(month) {
        const report = this.generateBudgetReport(month);
        
        if (!report) {
            this.showError('No budget data available for this month');
            return;
        }

        const dataStr = JSON.stringify(report, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `budget_report_${month}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        this.showSuccess('Budget report exported successfully!');
    },

    // Set budget alerts
    checkBudgetAlerts() {
        const currentMonth = new Date().toISOString().slice(0, 7);
        const insights = this.getBudgetInsights(currentMonth);
        
        if (!insights) return;

        const criticalAlerts = insights.alerts.filter(alert => alert.type === 'critical');
        
        if (criticalAlerts.length > 0) {
            this.showBudgetAlert(criticalAlerts);
        }
    },

    // Show budget alert notification
    showBudgetAlert(alerts) {
        const alertContainer = document.createElement('div');
        alertContainer.className = 'budget-alert-container';
        alertContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--error-color);
            color: white;
            padding: 1rem;
            border-radius: var(--border-radius);
            z-index: 3000;
            max-width: 300px;
            box-shadow: var(--shadow-lg);
        `;

        const alertHtml = `
            <h4 style="margin: 0 0 0.5rem 0; font-size: 1rem;">Budget Alert!</h4>
            ${alerts.map(alert => `
                <div style="margin-bottom: 0.5rem; font-size: 0.9rem;">
                    ${alert.message}
                </div>
            `).join('')}
            <button onclick="this.parentElement.remove()" style="
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 0.5rem;
            ">Dismiss</button>
        `;

        alertContainer.innerHTML = alertHtml;
        document.body.appendChild(alertContainer);

        // Auto-dismiss after 10 seconds
        setTimeout(() => {
            if (alertContainer.parentElement) {
                alertContainer.remove();
            }
        }, 10000);
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    BudgetManager.init();
    
    // Check for budget alerts every hour
    setInterval(() => {
        BudgetManager.checkBudgetAlerts();
    }, 60 * 60 * 1000); // 1 hour
});

// Make BudgetManager available globally
window.BudgetManager = BudgetManager;