// FinFree - Financial Calculators Module
// Professional financial calculators with modal system integration

const FinancialCalculators = {
    // Initialize calculators
    init() {
        console.log('Initializing Financial Calculators...');
        this.bindEvents();
        console.log('Financial Calculators initialized');
    },

    // Bind calculator events
    bindEvents() {
        // Calculator events are handled by onclick attributes in HTML
        console.log('Calculator events bound');
    },

    // Open calculator
    openCalculator(calculatorType) {
        console.log('Opening calculator:', calculatorType);
        
        // Show calculator results section
        const resultsSection = document.getElementById('calculator-results');
        if (resultsSection) {
            resultsSection.style.display = 'block';
            resultsSection.classList.add('active');
            resultsSection.scrollIntoView({ behavior: 'smooth' });
            console.log('Results section displayed');
        } else {
            console.error('Calculator results section not found');
            return;
        }

        // Update calculator title
        const titleElement = document.getElementById('calculator-title');
        if (titleElement) {
            titleElement.textContent = this.getCalculatorTitle(calculatorType);
        }

        // Load calculator content
        const contentElement = document.getElementById('calculator-content');
        if (contentElement) {
            contentElement.innerHTML = this.getCalculatorContent(calculatorType);
            
            // Initialize calculator-specific functionality
            this.initializeCalculator(calculatorType);
        }
    },

    // Clear calculator results
    clearCalculatorResults() {
        const resultsSection = document.getElementById('calculator-results');
        if (resultsSection) {
            resultsSection.classList.remove('active');
            resultsSection.style.display = 'none';
        }
    },

    // Get calculator title
    getCalculatorTitle(calculatorType) {
        const titles = {
            'emergency-fund': 'Emergency Fund Calculator',
            'loan': 'Loan Calculator',
            'retirement': 'Retirement Calculator',
            'investment': 'Investment Calculator',
            'debt-payoff': 'Debt Payoff Calculator',
            'mortgage': 'Mortgage Calculator',
            'savings-goal': 'Savings Goal Calculator',
            'tax': 'Tax Calculator',
            'net-worth': 'Net Worth Calculator'
        };
        return titles[calculatorType] || 'Financial Calculator';
    },

    // Get calculator content HTML
    getCalculatorContent(calculatorType) {
        switch(calculatorType) {
            case 'emergency-fund':
                return this.getEmergencyFundCalculator();
            case 'loan':
                return this.getLoanCalculator();
            case 'retirement':
                return this.getRetirementCalculator();
            case 'investment':
                return this.getInvestmentCalculator();
            case 'debt-payoff':
                return this.getDebtPayoffCalculator();
            case 'mortgage':
                return this.getMortgageCalculator();
            case 'savings-goal':
                return this.getSavingsGoalCalculator();
            case 'tax':
                return this.getTaxCalculator();
            case 'net-worth':
                return this.getNetWorthCalculator();
            default:
                return '<p>Calculator not available yet.</p>';
        }
    },

    // Emergency Fund Calculator HTML
    getEmergencyFundCalculator() {
        return `
            <div class="calculator-form">
                <div class="form-group">
                    <label for="monthly-expenses">Monthly Expenses ($)</label>
                    <input type="number" id="monthly-expenses" placeholder="3000" step="0.01">
                </div>
                <div class="form-group">
                    <label for="months-coverage">Months of Coverage</label>
                    <select id="months-coverage">
                        <option value="3">3 months (Minimum)</option>
                        <option value="6" selected>6 months (Recommended)</option>
                        <option value="9">9 months (Conservative)</option>
                        <option value="12">12 months (Very Conservative)</option>
                    </select>
                </div>
                <button onclick="FinancialCalculators.calculateEmergencyFund()" class="calculate-btn">Calculate Emergency Fund</button>
                <div id="emergency-fund-result" class="calculation-results" style="display: none;"></div>
            </div>
        `;
    },

    // Loan Calculator HTML
    getLoanCalculator() {
        return `
            <div class="calculator-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="loan-amount">Loan Amount ($)</label>
                        <input type="number" id="loan-amount" placeholder="10000" step="0.01">
                    </div>
                    <div class="form-group">
                        <label for="interest-rate">Annual Interest Rate (%)</label>
                        <input type="number" id="interest-rate" placeholder="5.5" step="0.01">
                    </div>
                </div>
                <div class="form-group">
                    <label for="loan-term">Loan Term (months)</label>
                    <input type="number" id="loan-term" placeholder="60" min="1">
                </div>
                <button onclick="FinancialCalculators.calculateLoan()" class="calculate-btn">Calculate Loan Payment</button>
                <div id="loan-result" class="calculation-results" style="display: none;"></div>
            </div>
        `;
    },

    // Investment Calculator HTML
    getInvestmentCalculator() {
        return `
            <div class="calculator-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="initial-investment">Initial Investment ($)</label>
                        <input type="number" id="initial-investment" placeholder="1000" step="0.01">
                    </div>
                    <div class="form-group">
                        <label for="monthly-contribution">Monthly Contribution ($)</label>
                        <input type="number" id="monthly-contribution" placeholder="100" step="0.01">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="annual-return">Expected Annual Return (%)</label>
                        <input type="number" id="annual-return" placeholder="7" step="0.01">
                    </div>
                    <div class="form-group">
                        <label for="investment-years">Investment Period (years)</label>
                        <input type="number" id="investment-years" placeholder="10" min="1">
                    </div>
                </div>
                <button onclick="FinancialCalculators.calculateInvestment()" class="btn btn-primary">Calculate</button>
                <div id="investment-result" class="calculator-result"></div>
            </div>
        `;
    },

    // Initialize calculator-specific functionality
    initializeCalculator(calculatorType) {
        console.log('Initializing calculator:', calculatorType);
        
        // Add any calculator-specific initialization here
        const inputs = document.querySelectorAll('#calculator-content input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                // Auto-calculate on input change (optional)
                console.log('Input changed:', input.value);
            });
        });
    },

    // Calculate Emergency Fund
    calculateEmergencyFund() {
        console.log('Calculating emergency fund...');
        
        const monthlyExpenses = parseFloat(document.getElementById('monthly-expenses').value) || 0;
        const monthsCoverage = parseFloat(document.getElementById('months-coverage').value) || 6;
        
        if (monthlyExpenses <= 0) {
            alert('Please enter a valid monthly expense amount.');
            return;
        }

        const emergencyFund = monthlyExpenses * monthsCoverage;
        const resultDiv = document.getElementById('emergency-fund-result');
        
        if (!resultDiv) {
            console.error('Emergency fund result container not found');
            return;
        }
        
        resultDiv.innerHTML = `
            <div class="result-card">
                <h3>Emergency Fund Target</h3>
                <div class="result-amount">${this.formatCurrency(emergencyFund)}</div>
                <div class="result-details">
                    <p><strong>Monthly Expenses:</strong> ${this.formatCurrency(monthlyExpenses)}</p>
                    <p><strong>Coverage Period:</strong> ${monthsCoverage} months</p>
                    <div class="savings-plan">
                        <h4>Savings Plan</h4>
                        <p>Save <strong>${this.formatCurrency(emergencyFund / 12)}</strong> per month to reach your goal in 1 year</p>
                        <p>Save <strong>${this.formatCurrency(emergencyFund / 24)}</strong> per month to reach your goal in 2 years</p>
                    </div>
                </div>
            </div>
        `;
        
        console.log('Emergency fund calculation completed');
    },

    // Calculate Loan
    calculateLoan() {
        console.log('Calculating loan...');
        
        const loanAmount = parseFloat(document.getElementById('loan-amount').value) || 0;
        const annualRate = parseFloat(document.getElementById('interest-rate').value) || 0;
        const loanTermMonths = parseFloat(document.getElementById('loan-term').value) || 0;
        
        if (loanAmount <= 0 || annualRate < 0 || loanTermMonths <= 0) {
            alert('Please enter valid loan details.');
            return;
        }

        const monthlyRate = (annualRate / 100) / 12;
        const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths)) / (Math.pow(1 + monthlyRate, loanTermMonths) - 1);
        const totalPayment = monthlyPayment * loanTermMonths;
        const totalInterest = totalPayment - loanAmount;

        const resultDiv = document.getElementById('loan-result');
        
        if (!resultDiv) {
            console.error('Loan result container not found');
            return;
        }
        
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            <h4>💰 Loan Payment Breakdown</h4>
            <div class="result-item">
                <span class="result-label">Monthly Payment</span>
                <span class="result-value">${this.formatCurrency(monthlyPayment)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Total Amount Paid</span>
                <span class="result-value">${this.formatCurrency(totalPayment)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Total Interest</span>
                <span class="result-value">${this.formatCurrency(totalInterest)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Loan Term</span>
                <span class="result-value">${loanTermMonths} months (${Math.round(loanTermMonths/12)} years)</span>
            </div>
        `;
        
        console.log('Loan calculation completed');
    },

    // Calculate Investment
    calculateInvestment() {
        console.log('Calculating investment...');
        
        const initialInvestment = parseFloat(document.getElementById('initial-investment').value) || 0;
        const monthlyContribution = parseFloat(document.getElementById('monthly-contribution').value) || 0;
        const annualReturn = parseFloat(document.getElementById('annual-return').value) || 0;
        const investmentYears = parseFloat(document.getElementById('investment-years').value) || 0;
        
        if (initialInvestment < 0 || monthlyContribution < 0 || annualReturn < 0 || investmentYears <= 0) {
            alert('Please enter valid investment details.');
            return;
        }

        const monthlyRate = (annualReturn / 100) / 12;
        const months = investmentYears * 12;
        
        // Future value of initial investment
        const futureInitial = initialInvestment * Math.pow(1 + monthlyRate, months);
        
        // Future value of monthly contributions (annuity)
        const futureContributions = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
        
        const totalFutureValue = futureInitial + futureContributions;
        const totalContributions = initialInvestment + (monthlyContribution * months);
        const totalEarnings = totalFutureValue - totalContributions;

        const resultDiv = document.getElementById('investment-result');
        
        if (!resultDiv) {
            console.error('Investment result container not found');
            return;
        }
        
        resultDiv.innerHTML = `
            <div class="result-card">
                <h3>Investment Projection</h3>
                <div class="result-amount">${this.formatCurrency(totalFutureValue)}</div>
                <div class="result-details">
                    <p><strong>Total Contributions:</strong> ${this.formatCurrency(totalContributions)}</p>
                    <p><strong>Total Earnings:</strong> ${this.formatCurrency(totalEarnings)}</p>
                    <p><strong>Initial Investment:</strong> ${this.formatCurrency(initialInvestment)}</p>
                    <p><strong>Monthly Contributions:</strong> ${this.formatCurrency(monthlyContribution)}</p>
                    <p><strong>Investment Period:</strong> ${investmentYears} years</p>
                    <p><strong>Expected Annual Return:</strong> ${annualReturn}%</p>
                </div>
            </div>
        `;
        
        console.log('Investment calculation completed');
    },

    // Placeholder methods for other calculators
    getRetirementCalculator() {
        return '<div class="calculator-form"><p>Retirement calculator coming soon...</p></div>';
    },

    getDebtPayoffCalculator() {
        return '<div class="calculator-form"><p>Debt payoff calculator coming soon...</p></div>';
    },

    getMortgageCalculator() {
        return '<div class="calculator-form"><p>Mortgage calculator coming soon...</p></div>';
    },

    getSavingsGoalCalculator() {
        return '<div class="calculator-form"><p>Savings goal calculator coming soon...</p></div>';
    },

    getTaxCalculator() {
        return '<div class="calculator-form"><p>Tax calculator coming soon...</p></div>';
    },

    getNetWorthCalculator() {
        return '<div class="calculator-form"><p>Net worth calculator coming soon...</p></div>';
    },

    // Utility method for currency formatting
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }
};

// Make globally available
window.FinancialCalculators = FinancialCalculators;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    FinancialCalculators.init();
});