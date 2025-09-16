// FinFree - Financial Calculators Module

// Financial calculators functionality
const FinancialCalculators = {
    // Initialize calculators
    init() {
        this.bindEvents();
    },

    // Bind event listeners
    bindEvents() {
        // Calculator tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const calcType = e.target.dataset.calc;
                this.showCalculator(calcType);
                this.updateTabs(e.target);
            });
        });
    },

    // Show specific calculator
    showCalculator(calcType) {
        // Hide all calculators
        document.querySelectorAll('.calculator').forEach(calc => {
            calc.classList.remove('active');
        });

        // Show target calculator
        const targetCalc = document.getElementById(`${calcType}-calculator`);
        if (targetCalc) {
            targetCalc.classList.add('active');
        }
    },

    // Update active tab
    updateTabs(activeTab) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeTab.classList.add('active');
    },

    // Format result display
    formatResult(title, value, details = []) {
        let html = `<h4>${title}</h4><div class="result-value">${value}</div>`;
        
        if (details.length > 0) {
            html += '<div class="result-details">';
            details.forEach(detail => {
                html += `<div class="detail-item"><span class="detail-label">${detail.label}:</span> <span class="detail-value">${detail.value}</span></div>`;
            });
            html += '</div>';
        }
        
        return html;
    }
};

// Dividend Calculator Functions
function calculateDividend() {
    const shares = parseFloat(document.getElementById('div-shares').value);
    const dividendPerShare = parseFloat(document.getElementById('div-per-share').value);
    const frequency = parseInt(document.getElementById('div-frequency').value);
    
    if (isNaN(shares) || isNaN(dividendPerShare) || shares <= 0 || dividendPerShare < 0) {
        document.getElementById('dividend-result').innerHTML = 
            '<div class="error">Please enter valid values for shares and dividend per share.</div>';
        return;
    }
    
    const annualDividend = shares * dividendPerShare * frequency;
    const monthlyDividend = annualDividend / 12;
    const quarterlyDividend = annualDividend / 4;
    
    const frequencyText = {
        1: 'Annual',
        2: 'Semi-Annual', 
        4: 'Quarterly',
        12: 'Monthly'
    };
    
    const details = [
        { label: 'Shares', value: shares.toLocaleString() },
        { label: 'Dividend per Share', value: FinFree.formatCurrency(dividendPerShare) },
        { label: 'Payment Frequency', value: frequencyText[frequency] },
        { label: 'Monthly Income', value: FinFree.formatCurrency(monthlyDividend) },
        { label: 'Quarterly Income', value: FinFree.formatCurrency(quarterlyDividend) }
    ];
    
    const result = FinancialCalculators.formatResult(
        'Annual Dividend Income',
        FinFree.formatCurrency(annualDividend),
        details
    );
    
    document.getElementById('dividend-result').innerHTML = result;
}

// Share Calculator Functions
function calculateShares() {
    const currentPrice = parseFloat(document.getElementById('share-price').value);
    const quantity = parseInt(document.getElementById('share-quantity').value);
    const purchasePrice = parseFloat(document.getElementById('purchase-price').value);
    
    if (isNaN(currentPrice) || isNaN(quantity) || currentPrice <= 0 || quantity <= 0) {
        document.getElementById('shares-result').innerHTML = 
            '<div class="error">Please enter valid values for share price and quantity.</div>';
        return;
    }
    
    const currentValue = currentPrice * quantity;
    let details = [
        { label: 'Number of Shares', value: quantity.toLocaleString() },
        { label: 'Current Price per Share', value: FinFree.formatCurrency(currentPrice) },
        { label: 'Current Total Value', value: FinFree.formatCurrency(currentValue) }
    ];
    
    if (!isNaN(purchasePrice) && purchasePrice > 0) {
        const purchaseValue = purchasePrice * quantity;
        const gainLoss = currentValue - purchaseValue;
        const gainLossPercent = ((gainLoss / purchaseValue) * 100);
        
        details.push(
            { label: 'Purchase Price per Share', value: FinFree.formatCurrency(purchasePrice) },
            { label: 'Purchase Value', value: FinFree.formatCurrency(purchaseValue) },
            { label: 'Gain/Loss', value: `${gainLoss >= 0 ? '+' : ''}${FinFree.formatCurrency(gainLoss)}` },
            { label: 'Gain/Loss %', value: `${gainLossPercent >= 0 ? '+' : ''}${gainLossPercent.toFixed(2)}%` }
        );
    }
    
    const result = FinancialCalculators.formatResult(
        'Share Portfolio Value',
        FinFree.formatCurrency(currentValue),
        details
    );
    
    document.getElementById('shares-result').innerHTML = result;
}

// Profit/Loss Calculator Functions
function calculateProfitLoss() {
    const buyPrice = parseFloat(document.getElementById('buy-price').value);
    const sellPrice = parseFloat(document.getElementById('sell-price').value);
    const shares = parseInt(document.getElementById('pl-shares').value);
    const commission = parseFloat(document.getElementById('commission').value) || 0;
    
    if (isNaN(buyPrice) || isNaN(sellPrice) || isNaN(shares) || 
        buyPrice <= 0 || sellPrice <= 0 || shares <= 0) {
        document.getElementById('profit-loss-result').innerHTML = 
            '<div class="error">Please enter valid values for buy price, sell price, and shares.</div>';
        return;
    }
    
    const buyValue = buyPrice * shares;
    const sellValue = sellPrice * shares;
    const grossProfitLoss = sellValue - buyValue;
    const netProfitLoss = grossProfitLoss - commission;
    const profitLossPercent = ((netProfitLoss / buyValue) * 100);
    
    const details = [
        { label: 'Buy Price per Share', value: FinFree.formatCurrency(buyPrice) },
        { label: 'Sell Price per Share', value: FinFree.formatCurrency(sellPrice) },
        { label: 'Number of Shares', value: shares.toLocaleString() },
        { label: 'Total Buy Value', value: FinFree.formatCurrency(buyValue) },
        { label: 'Total Sell Value', value: FinFree.formatCurrency(sellValue) },
        { label: 'Gross Profit/Loss', value: `${grossProfitLoss >= 0 ? '+' : ''}${FinFree.formatCurrency(grossProfitLoss)}` },
        { label: 'Commission/Fees', value: FinFree.formatCurrency(commission) },
        { label: 'Return %', value: `${profitLossPercent >= 0 ? '+' : ''}${profitLossPercent.toFixed(2)}%` }
    ];
    
    const resultClass = netProfitLoss >= 0 ? 'profit' : 'loss';
    const title = netProfitLoss >= 0 ? 'Net Profit' : 'Net Loss';
    
    let result = FinancialCalculators.formatResult(
        title,
        `${netProfitLoss >= 0 ? '+' : ''}${FinFree.formatCurrency(netProfitLoss)}`,
        details
    );
    
    // Add styling for profit/loss
    result = result.replace('class="result-value"', `class="result-value ${resultClass}"`);
    
    document.getElementById('profit-loss-result').innerHTML = result;
}

// Compound Interest Calculator Functions
function calculateCompoundInterest() {
    const principal = parseFloat(document.getElementById('principal').value);
    const rate = parseFloat(document.getElementById('interest-rate').value);
    const frequency = parseInt(document.getElementById('compound-frequency').value);
    const time = parseFloat(document.getElementById('time-period').value);
    
    if (isNaN(principal) || isNaN(rate) || isNaN(time) || 
        principal <= 0 || rate < 0 || time <= 0) {
        document.getElementById('compound-result').innerHTML = 
            '<div class="error">Please enter valid values for all fields.</div>';
        return;
    }
    
    // Compound interest formula: A = P(1 + r/n)^(nt)
    const r = rate / 100; // Convert percentage to decimal
    const amount = principal * Math.pow((1 + r / frequency), frequency * time);
    const interest = amount - principal;
    
    // Calculate breakdown by year
    const yearlyBreakdown = [];
    for (let year = 1; year <= Math.min(time, 10); year++) {
        const yearlyAmount = principal * Math.pow((1 + r / frequency), frequency * year);
        const yearlyInterest = yearlyAmount - principal;
        yearlyBreakdown.push({
            year: year,
            amount: yearlyAmount,
            interest: yearlyInterest
        });
    }
    
    const frequencyText = {
        1: 'Annually',
        2: 'Semi-Annually',
        4: 'Quarterly',
        12: 'Monthly',
        365: 'Daily'
    };
    
    const details = [
        { label: 'Principal Amount', value: FinFree.formatCurrency(principal) },
        { label: 'Interest Rate', value: `${rate}% per year` },
        { label: 'Compounding', value: frequencyText[frequency] },
        { label: 'Time Period', value: `${time} years` },
        { label: 'Total Interest', value: FinFree.formatCurrency(interest) },
        { label: 'Effective Annual Rate', value: `${((Math.pow(1 + r/frequency, frequency) - 1) * 100).toFixed(2)}%` }
    ];
    
    let result = FinancialCalculators.formatResult(
        'Future Value',
        FinFree.formatCurrency(amount),
        details
    );
    
    // Add yearly breakdown table if time period is reasonable
    if (time <= 10 && yearlyBreakdown.length > 0) {
        result += '<div class="yearly-breakdown"><h5>Yearly Breakdown:</h5><table class="breakdown-table">';
        result += '<tr><th>Year</th><th>Amount</th><th>Interest Earned</th></tr>';
        
        yearlyBreakdown.forEach(year => {
            result += `<tr>
                <td>${year.year}</td>
                <td>${FinFree.formatCurrency(year.amount)}</td>
                <td>${FinFree.formatCurrency(year.interest)}</td>
            </tr>`;
        });
        
        result += '</table></div>';
    }
    
    document.getElementById('compound-result').innerHTML = result;
}

// Additional calculator functions

// Calculate required savings for a goal
function calculateSavingsGoal(targetAmount, currentAmount, timeMonths, interestRate = 0) {
    const remaining = targetAmount - currentAmount;
    
    if (interestRate > 0) {
        // With compound interest
        const monthlyRate = interestRate / 100 / 12;
        const monthlyPayment = remaining * monthlyRate / (Math.pow(1 + monthlyRate, timeMonths) - 1);
        return monthlyPayment;
    } else {
        // Simple division without interest
        return remaining / timeMonths;
    }
}

// Calculate mortgage payment
function calculateMortgage(principal, rate, years) {
    const monthlyRate = rate / 100 / 12;
    const numPayments = years * 12;
    
    if (rate === 0) {
        return principal / numPayments;
    }
    
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                          (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    return monthlyPayment;
}

// Calculate loan EMI
function calculateEMI(principal, rate, tenure) {
    const monthlyRate = rate / 100 / 12;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                (Math.pow(1 + monthlyRate, tenure) - 1);
    
    return emi;
}

// Retirement planning calculator
function calculateRetirement(currentAge, retirementAge, currentSavings, monthlyContribution, expectedReturn) {
    const yearsToRetirement = retirementAge - currentAge;
    const monthsToRetirement = yearsToRetirement * 12;
    const monthlyReturn = expectedReturn / 100 / 12;
    
    // Future value of current savings
    const futureValueCurrentSavings = currentSavings * Math.pow(1 + monthlyReturn, monthsToRetirement);
    
    // Future value of monthly contributions
    const futureValueContributions = monthlyContribution * 
        (Math.pow(1 + monthlyReturn, monthsToRetirement) - 1) / monthlyReturn;
    
    const totalRetirementFund = futureValueCurrentSavings + futureValueContributions;
    
    return {
        totalFund: totalRetirementFund,
        fromCurrentSavings: futureValueCurrentSavings,
        fromContributions: futureValueContributions,
        yearsToRetirement: yearsToRetirement
    };
}

// Add custom CSS for calculator results
const calculatorStyles = document.createElement('style');
calculatorStyles.textContent = `
    .result-value {
        font-size: 1.5rem;
        font-weight: 700;
        margin: 1rem 0;
        color: var(--primary-color);
    }

    .result-value.profit {
        color: var(--success-color);
    }

    .result-value.loss {
        color: var(--error-color);
    }

    .result-details {
        margin-top: 1rem;
        padding: 1rem;
        background: var(--bg-color);
        border-radius: var(--border-radius);
    }

    .detail-item {
        display: flex;
        justify-content: space-between;
        padding: 0.25rem 0;
        border-bottom: 1px solid var(--border-color);
    }

    .detail-item:last-child {
        border-bottom: none;
    }

    .detail-label {
        font-weight: 500;
        color: var(--text-secondary);
    }

    .detail-value {
        font-weight: 600;
        color: var(--text-primary);
    }

    .yearly-breakdown {
        margin-top: 1.5rem;
    }

    .breakdown-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 0.5rem;
    }

    .breakdown-table th,
    .breakdown-table td {
        padding: 0.5rem;
        text-align: right;
        border: 1px solid var(--border-color);
    }

    .breakdown-table th {
        background: var(--primary-color);
        color: white;
        font-weight: 600;
    }

    .breakdown-table td:first-child,
    .breakdown-table th:first-child {
        text-align: center;
    }

    .error {
        color: var(--error-color);
        padding: 1rem;
        background: rgba(220, 38, 38, 0.1);
        border-radius: var(--border-radius);
        border: 1px solid var(--error-color);
    }

    @media (max-width: 768px) {
        .breakdown-table {
            font-size: 0.9rem;
        }
        
        .breakdown-table th,
        .breakdown-table td {
            padding: 0.25rem;
        }
        
        .detail-item {
            flex-direction: column;
            gap: 0.25rem;
        }
        
        .detail-value {
            text-align: right;
        }
    }
`;

document.head.appendChild(calculatorStyles);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    FinancialCalculators.init();
});

// Make functions available globally
window.FinancialCalculators = FinancialCalculators;
window.calculateDividend = calculateDividend;
window.calculateShares = calculateShares;
window.calculateProfitLoss = calculateProfitLoss;
window.calculateCompoundInterest = calculateCompoundInterest;
window.calculateSavingsGoal = calculateSavingsGoal;
window.calculateMortgage = calculateMortgage;
window.calculateEMI = calculateEMI;
window.calculateRetirement = calculateRetirement;