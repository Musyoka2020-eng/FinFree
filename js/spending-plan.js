// FinFree - Conscious Spending Plan Module (Based on Ramit Sethi's approach)

// Conscious Spending Plan functionality
const ConsciousSpending = {
    // Default allocation percentages
    defaultAllocations: {
        fixedCosts: 60,      // 50-60%
        investments: 10,     // 10%
        savings: 5,          // 5-10%
        guiltFree: 25        // 20-35%
    },

    // Initialize conscious spending plan
    init() {
        this.bindEvents();
        this.loadSavedPlan();
    },

    // Bind event listeners
    bindEvents() {
        // Take-home income input
        const incomeInput = document.getElementById('take-home-income');
        if (incomeInput) {
            incomeInput.addEventListener('input', () => {
                this.updateCalculations();
            });
        }

        // Calculate button
        const calculateBtn = document.querySelector('#conscious-spending-form button');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => {
                this.calculateSpendingPlan();
            });
        }
    },

    // Update calculations in real-time
    updateCalculations() {
        const income = parseFloat(document.getElementById('take-home-income').value) || 0;
        
        if (income > 0) {
            this.updateAllocationInputs(income);
        }
    },

    // Update allocation input fields
    updateAllocationInputs(income) {
        const allocations = this.defaultAllocations;
        
        document.getElementById('fixed-costs').value = (income * allocations.fixedCosts / 100).toFixed(2);
        document.getElementById('investments').value = (income * allocations.investments / 100).toFixed(2);
        document.getElementById('savings').value = (income * allocations.savings / 100).toFixed(2);
        document.getElementById('guilt-free').value = (income * allocations.guiltFree / 100).toFixed(2);
    },

    // Calculate and display spending plan
    calculateSpendingPlan() {
        const income = parseFloat(document.getElementById('take-home-income').value);
        
        if (!income || income <= 0) {
            this.showError('Please enter your monthly take-home income');
            return;
        }

        const plan = this.generateSpendingPlan(income);
        this.displaySpendingPlan(plan);
        this.savePlan(plan);
        this.showSuccess('Conscious spending plan calculated successfully!');
    },

    // Generate spending plan object
    generateSpendingPlan(income) {
        const allocations = this.defaultAllocations;
        
        const plan = {
            income: income,
            generatedAt: new Date().toISOString(),
            allocations: {
                fixedCosts: {
                    amount: income * allocations.fixedCosts / 100,
                    percentage: allocations.fixedCosts,
                    description: 'Rent/mortgage, utilities, insurance, minimum debt payments',
                    tips: [
                        'Negotiate rent or refinance mortgage if possible',
                        'Shop around for insurance annually',
                        'Consider bundling services for discounts',
                        'Pay minimums on debt, extra goes to guilt-free spending'
                    ]
                },
                investments: {
                    amount: income * allocations.investments / 100,
                    percentage: allocations.investments,
                    description: '401k, Roth IRA, investment accounts',
                    tips: [
                        'Automate investments first - pay yourself first',
                        'Maximize employer 401k match',
                        'Consider low-cost index funds',
                        'Increase by 1% annually or with raises'
                    ]
                },
                savings: {
                    amount: income * allocations.savings / 100,
                    percentage: allocations.savings,
                    description: 'Emergency fund, vacation fund, wedding, etc.',
                    tips: [
                        'Build emergency fund to 3-6 months of expenses',
                        'Separate savings for different goals',
                        'Use high-yield savings accounts',
                        'Automate transfers after payday'
                    ]
                },
                guiltFree: {
                    amount: income * allocations.guiltFree / 100,
                    percentage: allocations.guiltFree,
                    description: 'Dining out, movies, clothes, hobbies',
                    tips: [
                        'Spend extravagantly on things you love',
                        'Cut costs mercilessly on things you don\'t',
                        'No guilt when spending within this budget',
                        'Track to ensure you don\'t overspend'
                    ]
                }
            },
            weeklyBreakdown: this.calculateWeeklyBreakdown(income, allocations),
            insights: this.generateInsights(income, allocations),
            actionItems: this.generateActionItems(income)
        };

        return plan;
    },

    // Calculate weekly spending breakdown
    calculateWeeklyBreakdown(income, allocations) {
        return {
            fixedCosts: (income * allocations.fixedCosts / 100) / 4.33, // Average weeks per month
            investments: (income * allocations.investments / 100) / 4.33,
            savings: (income * allocations.savings / 100) / 4.33,
            guiltFree: (income * allocations.guiltFree / 100) / 4.33
        };
    },

    // Generate insights based on income level
    generateInsights(income, allocations) {
        const insights = [];
        const fixedCostsAmount = income * allocations.fixedCosts / 100;
        const guiltFreeAmount = income * allocations.guiltFree / 100;

        // Income level insights
        if (income < 3000) {
            insights.push({
                type: 'focus',
                title: 'Focus on Income Growth',
                message: 'At your current income level, prioritize increasing your earning potential through skills development or side hustles.',
                action: 'Consider online courses, certifications, or freelancing opportunities'
            });
        } else if (income > 8000) {
            insights.push({
                type: 'optimize',
                title: 'Optimization Opportunity',
                message: 'You have room to increase your investment percentage for accelerated wealth building.',
                action: 'Consider increasing investments to 15-20% of income'
            });
        }

        // Fixed costs insight
        if (fixedCostsAmount > income * 0.7) {
            insights.push({
                type: 'warning',
                title: 'High Fixed Costs',
                message: 'Your fixed costs are quite high. Look for opportunities to reduce them.',
                action: 'Review housing, transportation, and subscription costs'
            });
        }

        // Guilt-free spending insight
        if (guiltFreeAmount > 500) {
            insights.push({
                type: 'opportunity',
                title: 'Rich Life Opportunity',
                message: 'You have significant guilt-free spending available. Make sure you\'re using it on things you truly love.',
                action: 'Define what your "rich life" looks like and allocate accordingly'
            });
        }

        return insights;
    },

    // Generate personalized action items
    generateActionItems(income) {
        const actions = [
            {
                priority: 'high',
                task: 'Automate your investments',
                description: 'Set up automatic transfers to investment accounts on payday',
                timeframe: 'This week'
            },
            {
                priority: 'high',
                task: 'Build your emergency fund',
                description: 'Start with $1,000, then work toward 3-6 months of expenses',
                timeframe: 'Next 3 months'
            },
            {
                priority: 'medium',
                task: 'Negotiate fixed costs',
                description: 'Call providers to negotiate lower rates on insurance, phone, internet',
                timeframe: 'This month'
            },
            {
                priority: 'medium',
                task: 'Define your rich life',
                description: 'List 3-5 things you love spending money on without guilt',
                timeframe: 'This week'
            },
            {
                priority: 'low',
                task: 'Review and optimize',
                description: 'Reassess your conscious spending plan quarterly',
                timeframe: 'Every 3 months'
            }
        ];

        // Add income-specific actions
        if (income < 4000) {
            actions.unshift({
                priority: 'high',
                task: 'Increase your income',
                description: 'Focus on earning more through raises, side hustles, or new skills',
                timeframe: 'Next 6 months'
            });
        }

        return actions;
    },

    // Display spending plan results
    displaySpendingPlan(plan) {
        const resultContainer = document.getElementById('spending-plan-result');
        const breakdownContainer = document.getElementById('plan-breakdown');
        
        if (!resultContainer || !breakdownContainer) return;

        // Show result container
        resultContainer.classList.remove('hidden');

        // Generate breakdown HTML
        const breakdownHTML = `
            <div class="breakdown-item">
                <h4>Fixed Costs (${plan.allocations.fixedCosts.percentage}%)</h4>
                <span class="amount">${FinFree.formatCurrency(plan.allocations.fixedCosts.amount)}</span>
                <p class="description">${plan.allocations.fixedCosts.description}</p>
            </div>
            <div class="breakdown-item">
                <h4>Investments (${plan.allocations.investments.percentage}%)</h4>
                <span class="amount">${FinFree.formatCurrency(plan.allocations.investments.amount)}</span>
                <p class="description">${plan.allocations.investments.description}</p>
            </div>
            <div class="breakdown-item">
                <h4>Savings (${plan.allocations.savings.percentage}%)</h4>
                <span class="amount">${FinFree.formatCurrency(plan.allocations.savings.amount)}</span>
                <p class="description">${plan.allocations.savings.description}</p>
            </div>
            <div class="breakdown-item">
                <h4>Guilt-Free Spending (${plan.allocations.guiltFree.percentage}%)</h4>
                <span class="amount">${FinFree.formatCurrency(plan.allocations.guiltFree.amount)}</span>
                <p class="description">${plan.allocations.guiltFree.description}</p>
            </div>
        `;

        breakdownContainer.innerHTML = breakdownHTML;

        // Add insights and action items
        this.displayInsights(plan.insights);
        this.displayActionItems(plan.actionItems);
    },

    // Display insights
    displayInsights(insights) {
        const tipsContainer = document.querySelector('.plan-tips ul');
        if (!tipsContainer) return;

        // Clear existing tips and add new insights
        const insightItems = insights.map(insight => `
            <li class="insight-item ${insight.type}">
                <strong>${insight.title}:</strong> ${insight.message}
                ${insight.action ? `<br><em>Action: ${insight.action}</em>` : ''}
            </li>
        `).join('');

        const originalTips = `
            <li>Automate your investments and savings first</li>
            <li>Track your fixed costs monthly</li>
            <li>Spend guilt-free on things you love, cut costs mercilessly on things you don't</li>
            <li>Review and adjust your plan every 3 months</li>
        `;

        tipsContainer.innerHTML = originalTips + insightItems;
    },

    // Display action items
    displayActionItems(actions) {
        // Create action items section if it doesn't exist
        let actionSection = document.querySelector('.action-items');
        if (!actionSection) {
            const planResult = document.getElementById('spending-plan-result');
            actionSection = document.createElement('div');
            actionSection.className = 'action-items';
            planResult.appendChild(actionSection);
        }

        const actionHTML = `
            <h5>Your Action Plan</h5>
            <div class="action-list">
                ${actions.map(action => `
                    <div class="action-item priority-${action.priority}">
                        <div class="action-header">
                            <h6>${action.task}</h6>
                            <span class="priority-badge ${action.priority}">${action.priority.toUpperCase()}</span>
                        </div>
                        <p class="action-description">${action.description}</p>
                        <span class="action-timeframe">${action.timeframe}</span>
                    </div>
                `).join('')}
            </div>
        `;

        actionSection.innerHTML = actionHTML;
    },

    // Compare with actual spending
    compareWithActualSpending(plan) {
        const currentMonth = new Date().toISOString().slice(0, 7);
        const monthlyExpenses = ExpenseManager.getMonthlyExpenses(currentMonth);
        const monthlyIncome = IncomeManager.getMonthlyIncome(currentMonth);

        // Categorize actual expenses
        const actualSpending = {
            fixedCosts: 0,
            guiltFree: 0
        };

        // Categories that count as fixed costs
        const fixedCostCategories = ['bills', 'healthcare', 'transportation'];
        const guiltFreeCategories = ['food', 'entertainment', 'shopping', 'other'];

        monthlyExpenses.forEach(expense => {
            if (fixedCostCategories.includes(expense.category)) {
                actualSpending.fixedCosts += expense.amount;
            } else if (guiltFreeCategories.includes(expense.category)) {
                actualSpending.guiltFree += expense.amount;
            }
        });

        // Generate comparison report
        const comparison = {
            plan: plan,
            actual: {
                income: monthlyIncome.reduce((sum, inc) => sum + inc.amount, 0),
                fixedCosts: actualSpending.fixedCosts,
                guiltFree: actualSpending.guiltFree
            },
            variance: {
                income: 0,
                fixedCosts: 0,
                guiltFree: 0
            },
            recommendations: []
        };

        // Calculate variances
        comparison.variance.income = comparison.actual.income - plan.income;
        comparison.variance.fixedCosts = comparison.actual.fixedCosts - plan.allocations.fixedCosts.amount;
        comparison.variance.guiltFree = comparison.actual.guiltFree - plan.allocations.guiltFree.amount;

        // Generate recommendations
        if (comparison.variance.fixedCosts > plan.allocations.fixedCosts.amount * 0.1) {
            comparison.recommendations.push('Your fixed costs are significantly over budget. Review and reduce where possible.');
        }

        if (comparison.variance.guiltFree > plan.allocations.guiltFree.amount * 0.2) {
            comparison.recommendations.push('You\'re overspending on guilt-free items. Consider adjusting your allocations or reducing spending.');
        }

        return comparison;
    },

    // Save plan to localStorage
    savePlan(plan) {
        try {
            localStorage.setItem('consciousSpendingPlan', JSON.stringify(plan));
        } catch (error) {
            console.error('Error saving conscious spending plan:', error);
        }
    },

    // Load saved plan
    loadSavedPlan() {
        try {
            const saved = localStorage.getItem('consciousSpendingPlan');
            if (saved) {
                const plan = JSON.parse(saved);
                const incomeInput = document.getElementById('take-home-income');
                if (incomeInput) {
                    incomeInput.value = plan.income;
                    this.displaySpendingPlan(plan);
                }
            }
        } catch (error) {
            console.error('Error loading conscious spending plan:', error);
        }
    },

    // Export plan as PDF text
    exportPlan() {
        const saved = localStorage.getItem('consciousSpendingPlan');
        if (!saved) {
            this.showError('No conscious spending plan found to export');
            return;
        }

        const plan = JSON.parse(saved);
        const exportText = this.generatePlanText(plan);

        const blob = new Blob([exportText], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'conscious_spending_plan.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        this.showSuccess('Conscious spending plan exported successfully!');
    },

    // Generate plan text for export
    generatePlanText(plan) {
        return `CONSCIOUS SPENDING PLAN
Generated: ${new Date(plan.generatedAt).toLocaleDateString()}
Monthly Take-Home Income: ${FinFree.formatCurrency(plan.income)}

ALLOCATION BREAKDOWN:
===================
Fixed Costs (${plan.allocations.fixedCosts.percentage}%): ${FinFree.formatCurrency(plan.allocations.fixedCosts.amount)}
- ${plan.allocations.fixedCosts.description}

Investments (${plan.allocations.investments.percentage}%): ${FinFree.formatCurrency(plan.allocations.investments.amount)}
- ${plan.allocations.investments.description}

Savings (${plan.allocations.savings.percentage}%): ${FinFree.formatCurrency(plan.allocations.savings.amount)}
- ${plan.allocations.savings.description}

Guilt-Free Spending (${plan.allocations.guiltFree.percentage}%): ${FinFree.formatCurrency(plan.allocations.guiltFree.amount)}
- ${plan.allocations.guiltFree.description}

WEEKLY BREAKDOWN:
================
Fixed Costs: ${FinFree.formatCurrency(plan.weeklyBreakdown.fixedCosts)}
Investments: ${FinFree.formatCurrency(plan.weeklyBreakdown.investments)}
Savings: ${FinFree.formatCurrency(plan.weeklyBreakdown.savings)}
Guilt-Free: ${FinFree.formatCurrency(plan.weeklyBreakdown.guiltFree)}

ACTION ITEMS:
============
${plan.actionItems.map(item => `• ${item.task} (${item.priority.toUpperCase()}) - ${item.timeframe}
  ${item.description}`).join('\n')}

KEY PRINCIPLES:
==============
• Spend extravagantly on things you love
• Cut costs mercilessly on things you don't
• Automate your money system
• Review and adjust quarterly
`;
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

// Global function for calculating spending plan (called from HTML)
function calculateSpendingPlan() {
    ConsciousSpending.calculateSpendingPlan();
}

// Add styles for conscious spending plan
const spendingPlanStyles = document.createElement('style');
spendingPlanStyles.textContent = `
    .breakdown-item .description {
        font-size: 0.9rem;
        color: var(--text-secondary);
        margin-top: 0.25rem;
    }

    .insight-item {
        margin-bottom: 1rem !important;
        padding: 0.5rem;
        border-radius: 4px;
        border-left: 4px solid var(--primary-color);
    }

    .insight-item.warning {
        background: rgba(234, 179, 8, 0.1);
        border-left-color: var(--warning-color);
    }

    .insight-item.focus {
        background: rgba(59, 130, 246, 0.1);
        border-left-color: var(--info-color);
    }

    .insight-item.opportunity {
        background: rgba(16, 185, 129, 0.1);
        border-left-color: var(--success-color);
    }

    .action-items {
        margin-top: 2rem;
        padding: 1rem;
        background: var(--surface-color);
        border-radius: var(--border-radius);
    }

    .action-items h5 {
        color: var(--text-primary);
        margin-bottom: 1rem;
        font-size: 1.2rem;
    }

    .action-item {
        margin-bottom: 1rem;
        padding: 1rem;
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        background: var(--bg-color);
    }

    .action-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    .action-header h6 {
        margin: 0;
        color: var(--text-primary);
        font-size: 1rem;
    }

    .priority-badge {
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
        font-size: 0.7rem;
        font-weight: 600;
        text-transform: uppercase;
    }

    .priority-badge.high {
        background: var(--error-color);
        color: white;
    }

    .priority-badge.medium {
        background: var(--warning-color);
        color: white;
    }

    .priority-badge.low {
        background: var(--info-color);
        color: white;
    }

    .action-description {
        color: var(--text-secondary);
        margin: 0.5rem 0;
        font-size: 0.9rem;
    }

    .action-timeframe {
        font-size: 0.8rem;
        color: var(--primary-color);
        font-weight: 500;
    }

    @media (max-width: 768px) {
        .action-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
        }
    }
`;
document.head.appendChild(spendingPlanStyles);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    ConsciousSpending.init();
});

// Make ConsciousSpending available globally
window.ConsciousSpending = ConsciousSpending;
window.calculateSpendingPlan = calculateSpendingPlan;