// FinFree - Expense Tracking Module

// Expense management functionality
const ExpenseManager = {
    // Initialize expense tracking
    init() {
        this.bindEvents();
        this.bindFilterEvents();
    },

    // Bind event listeners for expense functionality
    bindEvents() {
        // Add expense button
        const addExpenseBtn = document.getElementById('add-expense-btn');
        if (addExpenseBtn) {
            addExpenseBtn.addEventListener('click', () => {
                Modal.show('expense-form');
            });
        }

        // Close expense form
        const closeExpenseForm = document.getElementById('close-expense-form');
        const cancelExpense = document.getElementById('cancel-expense');
        
        if (closeExpenseForm) {
            closeExpenseForm.addEventListener('click', () => {
                Modal.hide('expense-form');
            });
        }

        if (cancelExpense) {
            cancelExpense.addEventListener('click', () => {
                Modal.hide('expense-form');
            });
        }

        // Add expense form submission
        const addExpenseForm = document.getElementById('add-expense-form');
        if (addExpenseForm) {
            addExpenseForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addExpense();
            });
        }

        // Close modal when clicking outside
        const expenseModal = document.getElementById('expense-form');
        if (expenseModal) {
            expenseModal.addEventListener('click', (e) => {
                if (e.target === expenseModal) {
                    Modal.hide('expense-form');
                }
            });
        }
    },

    // Bind filter events
    bindFilterEvents() {
        const categoryFilter = document.getElementById('filter-category');
        const monthFilter = document.getElementById('filter-month');

        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                FinFree.displayExpenses();
            });
        }

        if (monthFilter) {
            monthFilter.addEventListener('change', () => {
                FinFree.displayExpenses();
            });
        }
    },

    // Add new expense
    addExpense() {
        const amount = parseFloat(document.getElementById('expense-amount').value);
        const category = document.getElementById('expense-category').value;
        const description = document.getElementById('expense-description').value.trim();
        const date = document.getElementById('expense-date').value;

        // Validation
        if (!amount || amount <= 0) {
            this.showError('Please enter a valid amount');
            return;
        }

        if (!category) {
            this.showError('Please select a category');
            return;
        }

        if (!description) {
            this.showError('Please enter a description');
            return;
        }

        if (!date) {
            this.showError('Please select a date');
            return;
        }

        // Create expense object
        const expense = {
            id: FinFree.generateId(),
            amount: amount,
            category: category,
            description: description,
            date: date,
            timestamp: new Date().toISOString()
        };

        // Add to data
        FinFree.data.expenses.push(expense);
        FinFree.saveData();

        // Update UI
        FinFree.displayExpenses();
        FinFree.updateDashboard();

        // Close modal and show success
        Modal.hide('expense-form');
        this.showSuccess(`Expense of ${FinFree.formatCurrency(amount)} added successfully!`);
    },

    // Delete expense
    deleteExpense(expenseId) {
        if (confirm('Are you sure you want to delete this expense?')) {
            FinFree.data.expenses = FinFree.data.expenses.filter(expense => expense.id !== expenseId);
            FinFree.saveData();
            FinFree.displayExpenses();
            FinFree.updateDashboard();
            this.showSuccess('Expense deleted successfully!');
        }
    },

    // Get expenses for a specific month
    getMonthlyExpenses(month) {
        return FinFree.data.expenses.filter(expense => expense.date.startsWith(month));
    },

    // Get expenses by category for a specific month
    getExpensesByCategory(month, category) {
        return FinFree.data.expenses.filter(expense => 
            expense.date.startsWith(month) && expense.category === category
        );
    },

    // Calculate total expenses for a month
    calculateMonthlyTotal(month) {
        return this.getMonthlyExpenses(month).reduce((total, expense) => total + expense.amount, 0);
    },

    // Calculate category total for a month
    calculateCategoryTotal(month, category) {
        return this.getExpensesByCategory(month, category).reduce((total, expense) => total + expense.amount, 0);
    },

    // Get expense statistics
    getExpenseStats() {
        const expenses = FinFree.data.expenses;
        const currentMonth = new Date().toISOString().slice(0, 7);
        const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7);

        const stats = {
            total: expenses.reduce((sum, expense) => sum + expense.amount, 0),
            currentMonth: this.calculateMonthlyTotal(currentMonth),
            lastMonth: this.calculateMonthlyTotal(lastMonth),
            categories: {}
        };

        // Calculate category statistics
        const categories = ['food', 'transportation', 'shopping', 'entertainment', 'bills', 'healthcare', 'education', 'other'];
        categories.forEach(category => {
            stats.categories[category] = {
                total: expenses.filter(e => e.category === category).reduce((sum, e) => sum + e.amount, 0),
                currentMonth: this.calculateCategoryTotal(currentMonth, category),
                count: expenses.filter(e => e.category === category).length
            };
        });

        return stats;
    },

    // Get top spending categories
    getTopCategories(limit = 5, month = null) {
        let expenses = FinFree.data.expenses;
        
        if (month) {
            expenses = expenses.filter(expense => expense.date.startsWith(month));
        }

        const categoryTotals = {};
        expenses.forEach(expense => {
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
        });

        return Object.entries(categoryTotals)
            .sort(([,a], [,b]) => b - a)
            .slice(0, limit)
            .map(([category, amount]) => ({
                category: FinFree.formatCategoryName(category),
                amount,
                percentage: expenses.length > 0 ? (amount / expenses.reduce((sum, e) => sum + e.amount, 0)) * 100 : 0
            }));
    },

    // Export expenses as CSV
    exportToCSV(month = null) {
        let expenses = FinFree.data.expenses;
        
        if (month) {
            expenses = expenses.filter(expense => expense.date.startsWith(month));
        }

        if (expenses.length === 0) {
            this.showError('No expenses to export');
            return;
        }

        const headers = ['Date', 'Category', 'Description', 'Amount'];
        const csvContent = [
            headers.join(','),
            ...expenses.map(expense => [
                expense.date,
                expense.category,
                `"${expense.description}"`,
                expense.amount
            ].join(','))
        ].join('\n');

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `expenses${month ? '_' + month : ''}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        this.showSuccess('Expenses exported successfully!');
    },

    // Import expenses from CSV
    importFromCSV(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const csv = e.target.result;
                const lines = csv.split('\n');
                const headers = lines[0].split(',');
                
                // Validate headers
                const expectedHeaders = ['Date', 'Category', 'Description', 'Amount'];
                const headersValid = expectedHeaders.every(header => headers.includes(header));
                
                if (!headersValid) {
                    this.showError('Invalid CSV format. Expected headers: ' + expectedHeaders.join(', '));
                    return;
                }

                let importedCount = 0;
                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line) continue;

                    const values = this.parseCSVLine(line);
                    if (values.length < 4) continue;

                    const expense = {
                        id: FinFree.generateId(),
                        date: values[0],
                        category: values[1],
                        description: values[2].replace(/^"|"$/g, ''), // Remove quotes
                        amount: parseFloat(values[3]),
                        timestamp: new Date().toISOString()
                    };

                    // Validate expense data
                    if (expense.date && expense.category && expense.description && expense.amount > 0) {
                        FinFree.data.expenses.push(expense);
                        importedCount++;
                    }
                }

                FinFree.saveData();
                FinFree.displayExpenses();
                FinFree.updateDashboard();
                this.showSuccess(`${importedCount} expenses imported successfully!`);

            } catch (error) {
                console.error('Error importing CSV:', error);
                this.showError('Error importing CSV file');
            }
        };
        reader.readAsText(file);
    },

    // Parse CSV line handling quoted values
    parseCSVLine(line) {
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current);
        
        return values;
    },

    // Show success message
    showSuccess(message) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'toast success';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            z-index: 3000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    },

    // Show error message
    showError(message) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'toast error';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--error-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            z-index: 3000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
};

// Add CSS for toast animations
const style = document.createElement('style');
style.textContent = `
@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    ExpenseManager.init();
});

// Make ExpenseManager available globally
window.ExpenseManager = ExpenseManager;