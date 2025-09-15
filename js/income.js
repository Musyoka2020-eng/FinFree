// FinFree - Income Tracking Module

// Income management functionality
const IncomeManager = {
    // Initialize income tracking
    init() {
        this.bindEvents();
    },

    // Bind event listeners for income functionality
    bindEvents() {
        // Add income button
        const addIncomeBtn = document.getElementById('add-income-btn');
        if (addIncomeBtn) {
            addIncomeBtn.addEventListener('click', () => {
                Modal.show('income-form');
            });
        }

        // Close income form
        const closeIncomeForm = document.getElementById('close-income-form');
        const cancelIncome = document.getElementById('cancel-income');
        
        if (closeIncomeForm) {
            closeIncomeForm.addEventListener('click', () => {
                Modal.hide('income-form');
            });
        }

        if (cancelIncome) {
            cancelIncome.addEventListener('click', () => {
                Modal.hide('income-form');
            });
        }

        // Add income form submission
        const addIncomeForm = document.getElementById('add-income-form');
        if (addIncomeForm) {
            addIncomeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addIncome();
            });
        }

        // Close modal when clicking outside
        const incomeModal = document.getElementById('income-form');
        if (incomeModal) {
            incomeModal.addEventListener('click', (e) => {
                if (e.target === incomeModal) {
                    Modal.hide('income-form');
                }
            });
        }
    },

    // Add new income
    addIncome() {
        const amount = parseFloat(document.getElementById('income-amount').value);
        const source = document.getElementById('income-source').value;
        const description = document.getElementById('income-description').value.trim();
        const date = document.getElementById('income-date').value;
        const recurring = document.getElementById('income-recurring').checked;

        // Validation
        if (!amount || amount <= 0) {
            this.showError('Please enter a valid amount');
            return;
        }

        if (!source) {
            this.showError('Please select an income source');
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

        // Create income object
        const income = {
            id: FinFree.generateId(),
            amount: amount,
            source: source,
            description: description,
            date: date,
            recurring: recurring,
            timestamp: new Date().toISOString()
        };

        // Add to data
        FinFree.data.income.push(income);

        // If recurring, ask for frequency and create future entries
        if (recurring) {
            this.handleRecurringIncome(income);
        }

        FinFree.saveData();

        // Update UI
        FinFree.displayIncome();
        FinFree.updateDashboard();

        // Close modal and show success
        Modal.hide('income-form');
        this.showSuccess(`Income of ${FinFree.formatCurrency(amount)} added successfully!`);
    },

    // Handle recurring income creation
    handleRecurringIncome(baseIncome) {
        const frequency = prompt('How often does this income recur?\n1. Weekly\n2. Bi-weekly\n3. Monthly\n4. Quarterly\nEnter number (1-4):');
        
        const frequencies = {
            '1': { days: 7, name: 'weekly' },
            '2': { days: 14, name: 'bi-weekly' },
            '3': { days: 30, name: 'monthly' },
            '4': { days: 90, name: 'quarterly' }
        };

        const selectedFreq = frequencies[frequency];
        if (!selectedFreq) return;

        const months = parseInt(prompt('For how many months should this recur? (1-12):', '12'));
        if (!months || months < 1 || months > 12) return;

        // Create future income entries
        const startDate = new Date(baseIncome.date);
        for (let i = 1; i <= months; i++) {
            const nextDate = new Date(startDate);
            nextDate.setDate(nextDate.getDate() + (selectedFreq.days * i));
            
            const futureIncome = {
                ...baseIncome,
                id: FinFree.generateId(),
                date: nextDate.toISOString().split('T')[0],
                description: `${baseIncome.description} (${selectedFreq.name} #${i + 1})`,
                parentId: baseIncome.id
            };
            
            FinFree.data.income.push(futureIncome);
        }

        // Mark original income with recurring info
        baseIncome.recurringInfo = {
            frequency: selectedFreq.name,
            months: months
        };
    },

    // Delete income
    deleteIncome(incomeId) {
        const income = FinFree.data.income.find(inc => inc.id === incomeId);
        if (!income) return;

        let confirmMessage = 'Are you sure you want to delete this income entry?';
        
        // If it's a recurring income parent, warn about related entries
        if (income.recurringInfo) {
            const relatedEntries = FinFree.data.income.filter(inc => inc.parentId === incomeId);
            if (relatedEntries.length > 0) {
                confirmMessage += `\n\nThis will also delete ${relatedEntries.length} related recurring entries.`;
            }
        }

        if (confirm(confirmMessage)) {
            // Delete the income and any related recurring entries
            FinFree.data.income = FinFree.data.income.filter(inc => 
                inc.id !== incomeId && inc.parentId !== incomeId
            );
            
            FinFree.saveData();
            FinFree.displayIncome();
            FinFree.updateDashboard();
            this.showSuccess('Income deleted successfully!');
        }
    },

    // Get income for a specific month
    getMonthlyIncome(month) {
        return FinFree.data.income.filter(income => income.date.startsWith(month));
    },

    // Get income by source for a specific month
    getIncomeBySource(month, source) {
        return FinFree.data.income.filter(income => 
            income.date.startsWith(month) && income.source === source
        );
    },

    // Calculate total income for a month
    calculateMonthlyTotal(month) {
        return this.getMonthlyIncome(month).reduce((total, income) => total + income.amount, 0);
    },

    // Calculate source total for a month
    calculateSourceTotal(month, source) {
        return this.getIncomeBySource(month, source).reduce((total, income) => total + income.amount, 0);
    },

    // Get income statistics
    getIncomeStats() {
        const income = FinFree.data.income;
        const currentMonth = new Date().toISOString().slice(0, 7);
        const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7);

        const stats = {
            total: income.reduce((sum, inc) => sum + inc.amount, 0),
            currentMonth: this.calculateMonthlyTotal(currentMonth),
            lastMonth: this.calculateMonthlyTotal(lastMonth),
            sources: {},
            recurring: income.filter(inc => inc.recurring).length,
            averageMonthly: this.calculateAverageMonthlyIncome()
        };

        // Calculate source statistics
        const sources = ['salary', 'freelance', 'business', 'investment', 'rental', 'other'];
        sources.forEach(source => {
            stats.sources[source] = {
                total: income.filter(inc => inc.source === source).reduce((sum, inc) => sum + inc.amount, 0),
                currentMonth: this.calculateSourceTotal(currentMonth, source),
                count: income.filter(inc => inc.source === source).length
            };
        });

        return stats;
    },

    // Calculate average monthly income over last 6 months
    calculateAverageMonthlyIncome() {
        const now = new Date();
        let totalIncome = 0;
        let monthCount = 0;

        for (let i = 0; i < 6; i++) {
            const month = new Date(now.getFullYear(), now.getMonth() - i, 1).toISOString().slice(0, 7);
            const monthlyIncome = this.calculateMonthlyTotal(month);
            
            if (monthlyIncome > 0) {
                totalIncome += monthlyIncome;
                monthCount++;
            }
        }

        return monthCount > 0 ? totalIncome / monthCount : 0;
    },

    // Get income trends
    getIncomeTrends(months = 6) {
        const trends = [];
        const now = new Date();

        for (let i = months - 1; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const month = date.toISOString().slice(0, 7);
            const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            const total = this.calculateMonthlyTotal(month);

            trends.push({
                month,
                monthName,
                total,
                sources: this.getSourceBreakdown(month)
            });
        }

        return trends;
    },

    // Get income breakdown by source for a month
    getSourceBreakdown(month) {
        const breakdown = {};
        const sources = ['salary', 'freelance', 'business', 'investment', 'rental', 'other'];

        sources.forEach(source => {
            const total = this.calculateSourceTotal(month, source);
            if (total > 0) {
                breakdown[source] = total;
            }
        });

        return breakdown;
    },

    // Generate income report
    generateIncomeReport(startMonth, endMonth) {
        const report = {
            period: `${FinFree.formatMonthYear(startMonth)} to ${FinFree.formatMonthYear(endMonth)}`,
            startMonth,
            endMonth,
            summary: {
                totalIncome: 0,
                averageMonthly: 0,
                highestMonth: { month: '', amount: 0 },
                lowestMonth: { month: '', amount: Infinity }
            },
            monthlyBreakdown: [],
            sourceAnalysis: {},
            generatedAt: new Date().toISOString()
        };

        // Calculate date range
        const start = new Date(startMonth + '-01');
        const end = new Date(endMonth + '-01');
        const months = [];

        let current = new Date(start);
        while (current <= end) {
            months.push(current.toISOString().slice(0, 7));
            current.setMonth(current.getMonth() + 1);
        }

        // Analyze each month
        months.forEach(month => {
            const monthlyTotal = this.calculateMonthlyTotal(month);
            const breakdown = this.getSourceBreakdown(month);

            report.summary.totalIncome += monthlyTotal;

            if (monthlyTotal > report.summary.highestMonth.amount) {
                report.summary.highestMonth = { month, amount: monthlyTotal };
            }

            if (monthlyTotal < report.summary.lowestMonth.amount && monthlyTotal > 0) {
                report.summary.lowestMonth = { month, amount: monthlyTotal };
            }

            report.monthlyBreakdown.push({
                month,
                monthName: FinFree.formatMonthYear(month),
                total: monthlyTotal,
                sources: breakdown
            });
        });

        report.summary.averageMonthly = report.summary.totalIncome / months.length;

        // Source analysis
        const sources = ['salary', 'freelance', 'business', 'investment', 'rental', 'other'];
        sources.forEach(source => {
            const sourceTotal = months.reduce((total, month) => 
                total + this.calculateSourceTotal(month, source), 0
            );
            
            if (sourceTotal > 0) {
                report.sourceAnalysis[source] = {
                    total: sourceTotal,
                    percentage: (sourceTotal / report.summary.totalIncome) * 100,
                    average: sourceTotal / months.length
                };
            }
        });

        return report;
    },

    // Export income data as CSV
    exportToCSV(month = null) {
        let incomeData = FinFree.data.income;
        
        if (month) {
            incomeData = incomeData.filter(income => income.date.startsWith(month));
        }

        if (incomeData.length === 0) {
            this.showError('No income data to export');
            return;
        }

        const headers = ['Date', 'Source', 'Description', 'Amount', 'Recurring'];
        const csvContent = [
            headers.join(','),
            ...incomeData.map(income => [
                income.date,
                income.source,
                `"${income.description}"`,
                income.amount,
                income.recurring ? 'Yes' : 'No'
            ].join(','))
        ].join('\n');

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `income${month ? '_' + month : ''}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        this.showSuccess('Income data exported successfully!');
    },

    // Export income report as PDF (simple text format)
    exportIncomeReport(startMonth, endMonth) {
        const report = this.generateIncomeReport(startMonth, endMonth);
        
        const reportText = `INCOME REPORT
${report.period}
Generated: ${new Date(report.generatedAt).toLocaleDateString()}

SUMMARY
Total Income: ${FinFree.formatCurrency(report.summary.totalIncome)}
Average Monthly: ${FinFree.formatCurrency(report.summary.averageMonthly)}
Highest Month: ${FinFree.formatMonthYear(report.summary.highestMonth.month)} - ${FinFree.formatCurrency(report.summary.highestMonth.amount)}
Lowest Month: ${FinFree.formatMonthYear(report.summary.lowestMonth.month)} - ${FinFree.formatCurrency(report.summary.lowestMonth.amount)}

MONTHLY BREAKDOWN
${report.monthlyBreakdown.map(month => 
    `${month.monthName}: ${FinFree.formatCurrency(month.total)}`
).join('\n')}

SOURCE ANALYSIS
${Object.entries(report.sourceAnalysis).map(([source, data]) =>
    `${FinFree.formatCategoryName(source)}: ${FinFree.formatCurrency(data.total)} (${data.percentage.toFixed(1)}%)`
).join('\n')}
`;

        const blob = new Blob([reportText], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `income_report_${startMonth}_${endMonth}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        this.showSuccess('Income report exported successfully!');
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
    IncomeManager.init();
});

// Make IncomeManager available globally
window.IncomeManager = IncomeManager;