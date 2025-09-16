// FinFree - Financial Guides Module

// Financial Guides functionality
const FinancialGuides = {
    // Guide content data
    guides: {
        'emergency-fund': {
            title: 'Emergency Fund Guide',
            icon: '🛡️',
            category: 'Safety Net',
            estimatedTime: '10 minutes',
            content: {
                introduction: 'An emergency fund is your financial safety net for unexpected expenses like medical bills, car repairs, or job loss.',
                steps: [
                    {
                        title: 'Determine Your Target Amount',
                        description: 'Calculate 3-6 months of essential expenses',
                        details: 'Start by listing all your essential monthly expenses: rent/mortgage, utilities, groceries, minimum debt payments, insurance, and transportation. Multiply this by 3-6 months depending on job stability.',
                        tips: ['Start with $1,000 if you have debt', 'Aim for 3 months if dual income', 'Target 6 months if single income or unstable job'],
                        action: 'Calculate your monthly essential expenses'
                    },
                    {
                        title: 'Choose the Right Account',
                        description: 'Keep it accessible but separate from daily spending',
                        details: 'Use a high-yield savings account that offers easy access but is separate from your checking account. Online banks often offer higher rates.',
                        tips: ['Look for accounts with no fees', 'Ensure FDIC insurance', 'Consider automatic transfers'],
                        action: 'Open a dedicated emergency fund savings account'
                    },
                    {
                        title: 'Automate Your Savings',
                        description: 'Set up automatic transfers to build consistently',
                        details: 'Start with whatever you can afford, even $25 per paycheck. The key is consistency, not the amount.',
                        tips: ['Transfer on payday', 'Start small and increase gradually', 'Use direct deposit if available'],
                        action: 'Set up automatic weekly or monthly transfers'
                    },
                    {
                        title: 'Boost Your Fund',
                        description: 'Find ways to accelerate your emergency fund growth',
                        details: 'Use windfalls like tax refunds, bonuses, or gifts to jumpstart your fund. Consider temporarily reducing discretionary spending.',
                        tips: ['Use the 50/50 rule: save half of windfalls', 'Sell unused items', 'Pick up a side gig temporarily'],
                        action: 'Identify potential windfalls or extra income sources'
                    },
                    {
                        title: 'When to Use It',
                        description: 'Know what constitutes a true emergency',
                        details: 'Use only for genuine emergencies: job loss, medical emergencies, urgent car repairs, or major home repairs.',
                        tips: ['Ask: Is this unexpected and necessary?', 'Not for vacations or wants', 'Replenish immediately after use'],
                        action: 'Define your emergency fund usage rules'
                    }
                ],
                tools: [
                    {
                        name: 'Emergency Fund Calculator',
                        description: 'Calculate how much you need and how long it will take to save',
                        action: 'calculate'
                    }
                ],
                conclusion: 'Building an emergency fund takes time, but it\'s one of the most important financial steps you can take. Start small and stay consistent.'
            }
        },
        'investment-basics': {
            title: 'Investment Basics',
            icon: '📈',
            category: 'Investing',
            estimatedTime: '15 minutes',
            content: {
                introduction: 'Investing is how you make your money work for you over time, building wealth through compound growth.',
                steps: [
                    {
                        title: 'Understand Investment Types',
                        description: 'Learn the basic investment vehicles',
                        details: 'Stocks represent ownership in companies, bonds are loans to companies or governments, and funds pool money to buy many investments.',
                        tips: ['Stocks offer higher potential returns but more risk', 'Bonds provide steady income with lower risk', 'Index funds offer instant diversification'],
                        action: 'Research different investment types'
                    },
                    {
                        title: 'Start with Index Funds',
                        description: 'Begin with low-cost, diversified investments',
                        details: 'Index funds track market indices like the S&P 500, offering instant diversification with minimal fees. They\'re perfect for beginners.',
                        tips: ['Look for expense ratios under 0.20%', 'Start with broad market funds', 'Consider target-date funds for retirement'],
                        action: 'Research low-cost index funds'
                    },
                    {
                        title: 'Choose Your Account Type',
                        description: 'Pick the right investment account for your goals',
                        details: 'Use 401(k) for employer matching, Roth IRA for tax-free growth, Traditional IRA for tax deductions, and taxable accounts for flexibility.',
                        tips: ['Max out employer 401(k) match first', 'Consider Roth IRA if in lower tax bracket', 'Use taxable accounts for short-term goals'],
                        action: 'Open appropriate investment accounts'
                    },
                    {
                        title: 'Dollar-Cost Averaging',
                        description: 'Invest consistently regardless of market conditions',
                        details: 'Invest the same amount regularly, which helps reduce the impact of market volatility and removes emotion from investing.',
                        tips: ['Automate your investments', 'Don\'t try to time the market', 'Stay consistent during market downturns'],
                        action: 'Set up automatic investment transfers'
                    },
                    {
                        title: 'Diversification Strategy',
                        description: 'Spread risk across different investments',
                        details: 'Don\'t put all your money in one stock or sector. Diversify across asset classes, geographic regions, and company sizes.',
                        tips: ['Use the 120 minus age rule for stock allocation', 'Include international investments', 'Rebalance annually'],
                        action: 'Create a diversified portfolio plan'
                    }
                ],
                tools: [
                    {
                        name: 'Compound Interest Calculator',
                        description: 'See how your investments can grow over time',
                        action: 'calculate'
                    }
                ],
                conclusion: 'Start investing as early as possible, even with small amounts. Time and consistency are more important than perfect timing.'
            }
        },
        'debt-payoff': {
            title: 'Debt Payoff Strategies',
            icon: '💳',
            category: 'Debt Management',
            estimatedTime: '12 minutes',
            content: {
                introduction: 'Strategic debt payoff can save thousands in interest and free up money for other financial goals.',
                steps: [
                    {
                        title: 'List All Your Debts',
                        description: 'Create a complete inventory of what you owe',
                        details: 'Include every debt: credit cards, student loans, car loans, personal loans. Note the balance, minimum payment, and interest rate for each.',
                        tips: ['Check credit reports for missed debts', 'Include store credit cards', 'Don\'t forget medical debt or family loans'],
                        action: 'Create a complete debt inventory'
                    },
                    {
                        title: 'Choose Your Strategy',
                        description: 'Pick between debt snowball and debt avalanche',
                        details: 'Debt snowball pays smallest balances first for motivation. Debt avalanche pays highest interest rates first for math optimization.',
                        tips: ['Snowball for motivation and quick wins', 'Avalanche for maximum interest savings', 'Hybrid approach is also valid'],
                        action: 'Decide on your debt payoff strategy'
                    },
                    {
                        title: 'Find Extra Money to Pay',
                        description: 'Identify funds to accelerate debt payoff',
                        details: 'Look for ways to reduce expenses temporarily and redirect that money to debt payments. Every extra dollar makes a difference.',
                        tips: ['Cancel unused subscriptions', 'Eat out less frequently', 'Use tax refunds and bonuses'],
                        action: 'Find $50-100 extra monthly for debt payments'
                    },
                    {
                        title: 'Consider Debt Consolidation',
                        description: 'Explore options to simplify and reduce interest',
                        details: 'Balance transfers, personal loans, or home equity loans might offer lower interest rates, but be careful not to rack up new debt.',
                        tips: ['Only if you get a lower rate', 'Avoid extending repayment unnecessarily', 'Don\'t use freed-up credit cards'],
                        action: 'Research consolidation options if beneficial'
                    },
                    {
                        title: 'Stay Motivated',
                        description: 'Keep momentum throughout your debt payoff journey',
                        details: 'Track progress visually, celebrate milestones, and remind yourself of the freedom you\'ll have once debt-free.',
                        tips: ['Use a debt thermometer to track progress', 'Celebrate each paid-off debt', 'Visualize your debt-free future'],
                        action: 'Set up a progress tracking system'
                    }
                ],
                tools: [
                    {
                        name: 'Debt Payoff Calculator',
                        description: 'Compare snowball vs avalanche strategies',
                        action: 'calculate'
                    }
                ],
                conclusion: 'Debt payoff is a marathon, not a sprint. Stay consistent, celebrate progress, and remember that every payment brings you closer to financial freedom.'
            }
        },
        'retirement-planning': {
            title: 'Retirement Planning',
            icon: '🏖️',
            category: 'Long-term Planning',
            estimatedTime: '18 minutes',
            content: {
                introduction: 'Starting retirement planning early gives you the power of compound interest and reduces the monthly amount needed to reach your goals.',
                steps: [
                    {
                        title: 'Set Your Retirement Goal',
                        description: 'Determine how much you\'ll need for retirement',
                        details: 'A common rule is to replace 70-90% of your pre-retirement income. Consider your expected lifestyle, healthcare costs, and desired retirement age.',
                        tips: ['Use the 4% withdrawal rule as a starting point', 'Factor in inflation over time', 'Consider healthcare cost increases'],
                        action: 'Calculate your retirement income needs'
                    },
                    {
                        title: 'Maximize Employer Matching',
                        description: 'Get free money from your employer',
                        details: 'Always contribute enough to your 401(k) to get the full employer match. This is an immediate 100% return on your money.',
                        tips: ['Contribute at least enough for full match', 'Increase contributions with raises', 'Understand vesting schedules'],
                        action: 'Maximize your employer 401(k) match'
                    },
                    {
                        title: 'Choose Between Roth and Traditional',
                        description: 'Understand tax implications of retirement accounts',
                        details: 'Traditional accounts give you a tax deduction now but you pay taxes in retirement. Roth accounts use after-tax money but grow tax-free.',
                        tips: ['Roth if you expect higher tax rates in retirement', 'Traditional if in high tax bracket now', 'Consider doing both for tax diversification'],
                        action: 'Decide on Roth vs Traditional strategy'
                    },
                    {
                        title: 'Automate and Increase',
                        description: 'Set up automatic contributions and regular increases',
                        details: 'Automate your retirement contributions and increase them annually or with raises. Even 1% increases make a huge difference over time.',
                        tips: ['Start with at least 10% of income', 'Increase by 1% each year', 'Use automatic escalation features'],
                        action: 'Set up automatic contribution increases'
                    },
                    {
                        title: 'Diversify Your Investments',
                        description: 'Build a balanced portfolio for long-term growth',
                        details: 'Use a mix of stocks and bonds appropriate for your age and risk tolerance. Younger investors can be more aggressive.',
                        tips: ['Use target-date funds for simplicity', 'Rebalance annually', 'Don\'t panic during market downturns'],
                        action: 'Create a diversified retirement portfolio'
                    }
                ],
                tools: [
                    {
                        name: 'Retirement Calculator',
                        description: 'Project your retirement savings growth',
                        action: 'calculate'
                    }
                ],
                conclusion: 'The key to retirement planning is starting early and staying consistent. Even small contributions grow significantly over decades through compound interest.'
            }
        }
    },

    // Current guide being displayed
    currentGuide: null,

    // Initialize guides
    init() {
        this.bindEvents();
        this.updateGuidesList();
    },

    // Bind event listeners
    bindEvents() {
        // Guide modal close buttons
        const closeGuideBtn = document.getElementById('close-guide');
        if (closeGuideBtn) {
            closeGuideBtn.addEventListener('click', () => {
                FinFree.hideModal('guide-modal');
            });
        }

        // Close modal when clicking outside
        const guideModal = document.getElementById('guide-modal');
        if (guideModal) {
            guideModal.addEventListener('click', (e) => {
                if (e.target === guideModal) {
                    FinFree.hideModal('guide-modal');
                }
            });
        }
    },

    // Update guides list in the UI
    updateGuidesList() {
        const container = document.getElementById('guides-list');
        if (!container) return;

        const html = Object.keys(this.guides).map(guideId => {
            const guide = this.guides[guideId];
            return `
                <div class="guide-card" onclick="FinancialGuides.openGuide('${guideId}')">
                    <div class="guide-icon">${guide.icon}</div>
                    <div class="guide-info">
                        <h3>${guide.title}</h3>
                        <p class="guide-category">${guide.category}</p>
                        <div class="guide-meta">
                            <span class="reading-time">
                                <i class="fas fa-clock"></i>
                                ${guide.estimatedTime}
                            </span>
                        </div>
                    </div>
                    <div class="guide-arrow">
                        <i class="fas fa-chevron-right"></i>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
    },

    // Open a specific guide
    async openGuide(guideId) {
        const guide = this.guides[guideId];
        
        // Show modal and wait for it to load
        await FinFree.showModal('guide-modal');
        
        // Wait for the modal content to be available
        await this.waitForModalReady();
        
        // Show loading state with realistic server delay
        await this.showLoadingState();
        
        if (!guide) {
            // Handle missing guide content
            this.showGuideNotAvailable(guideId);
            return;
        }

        this.currentGuide = guideId;
        this.displayGuide(guide);
    },

    // Show loading state with server-like delay
    async showLoadingState() {
        const titleElement = document.getElementById('guide-title');
        const contentElement = document.getElementById('guide-content');
        
        if (titleElement) {
            titleElement.innerHTML = `📚 Loading Guide...`;
        }
        
        if (contentElement) {
            contentElement.innerHTML = `
                <div class="loading-placeholder">
                    <div class="loading-spinner">
                        <i class="fas fa-spinner fa-spin"></i>
                    </div>
                    <p>Fetching guide content...</p>
                    <div class="loading-progress">
                        <div class="progress-bar"></div>
                    </div>
                </div>
            `;
        }
        
        // Realistic server delay (1.5-2.5 seconds)
        const delay = 1500 + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
    },

    // Wait for modal elements to be ready
    async waitForModalReady() {
        return new Promise((resolve) => {
            const checkReady = () => {
                const titleElement = document.getElementById('guide-title');
                const contentElement = document.getElementById('guide-content');
                
                if (titleElement && contentElement) {
                    resolve();
                } else {
                    setTimeout(checkReady, 50);
                }
            };
            checkReady();
        });
    },

    // Show not available message for missing guides
    showGuideNotAvailable(guideId) {
        // Update title
        const titleElement = document.getElementById('guide-title');
        if (titleElement) {
            titleElement.innerHTML = `📚 Guide Not Available`;
        }

        // Update content with not available message
        const contentElement = document.getElementById('guide-content');
        if (!contentElement) return;

        const guideNames = {
            'budgeting-101': 'Budgeting 101',
            'credit-score': 'Understanding Credit Scores', 
            'tax-optimization': 'Tax Optimization Strategies',
            'real-estate': 'Real Estate Investing',
            'finance-roadmap': 'Complete Personal Finance Roadmap',
            'debt-management': 'Debt Management Strategies'
        };

        const guideName = guideNames[guideId] || 'This Guide';

        const html = `
            <div class="guide-not-available">
                <div class="not-available-icon">
                    <i class="fas fa-construction"></i>
                </div>
                <h3>Guide Coming Soon!</h3>
                <p class="not-available-message">
                    <strong>${guideName}</strong> is currently being developed and will be available soon.
                </p>
                <div class="available-guides">
                    <h4>✅ Available Guides:</h4>
                    <ul>
                        <li><a href="#" onclick="FinancialGuides.openGuide('emergency-fund')">🛡️ Emergency Fund Guide</a></li>
                        <li><a href="#" onclick="FinancialGuides.openGuide('investment-basics')">📈 Investment Basics</a></li>
                        <li><a href="#" onclick="FinancialGuides.openGuide('debt-payoff')">💳 Debt Payoff Strategies</a></li>
                        <li><a href="#" onclick="FinancialGuides.openGuide('retirement-planning')">🏖️ Retirement Planning</a></li>
                    </ul>
                </div>
                <div class="guide-actions">
                    <button class="btn btn-secondary" onclick="FinFree.hideModal('guide-modal')">
                        <i class="fas fa-arrow-left"></i>
                        Back to Guides
                    </button>
                </div>
            </div>
        `;

        contentElement.innerHTML = html;
    },

    // Display guide content
    displayGuide(guide) {
        // Update title
        const titleElement = document.getElementById('guide-title');
        if (titleElement) {
            titleElement.innerHTML = `${guide.icon} ${guide.title}`;
        }

        // Update content
        const contentElement = document.getElementById('guide-content');
        if (!contentElement) return;

        const html = `
            <div class="guide-header">
                <div class="guide-meta">
                    <span class="category-badge">${guide.category}</span>
                    <span class="reading-time">
                        <i class="fas fa-clock"></i>
                        ${guide.estimatedTime}
                    </span>
                </div>
                <p class="guide-introduction">${guide.content.introduction}</p>
            </div>

            <div class="guide-steps">
                ${guide.content.steps.map((step, index) => `
                    <div class="guide-step">
                        <div class="step-number">${index + 1}</div>
                        <div class="step-content">
                            <h4>${step.title}</h4>
                            <p class="step-description">${step.description}</p>
                            <div class="step-details">${step.details}</div>
                            
                            ${step.tips.length > 0 ? `
                                <div class="step-tips">
                                    <h5><i class="fas fa-lightbulb"></i> Tips:</h5>
                                    <ul>
                                        ${step.tips.map(tip => `<li>${tip}</li>`).join('')}
                                    </ul>
                                </div>
                            ` : ''}
                            
                            <div class="step-action">
                                <strong>Action Step:</strong> ${step.action}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>

            ${guide.content.tools.length > 0 ? `
                <div class="guide-tools">
                    <h4><i class="fas fa-calculator"></i> Related Tools</h4>
                    <div class="tools-list">
                        ${guide.content.tools.map(tool => `
                            <div class="tool-item" onclick="FinancialGuides.useTool('${tool.action}')">
                                <div class="tool-info">
                                    <h5>${tool.name}</h5>
                                    <p>${tool.description}</p>
                                </div>
                                <button class="btn btn-primary btn-sm">
                                    <i class="fas fa-calculator"></i>
                                    Use Tool
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <div class="guide-conclusion">
                <div class="conclusion-content">
                    <h4><i class="fas fa-flag-checkered"></i> Key Takeaway</h4>
                    <p>${guide.content.conclusion}</p>
                </div>
            </div>

            <div class="guide-actions">
                <button class="btn btn-secondary" onclick="FinFree.hideModal('guide-modal')">
                    <i class="fas fa-arrow-left"></i>
                    Back to Guides
                </button>
                <button class="btn btn-primary" onclick="FinancialGuides.markAsRead('${this.currentGuide}')">
                    <i class="fas fa-check"></i>
                    Mark as Complete
                </button>
            </div>
        `;

        contentElement.innerHTML = html;
    },

    // Use a tool from within a guide
    useTool(action) {
        FinFree.hideModal('guide-modal');
        
        switch (action) {
            case 'calculate':
                // Navigate to calculators section
                FinFree.showSection('calculators');
                break;
            default:
                console.log('Tool action not implemented:', action);
        }
    },

    // Mark guide as read
    markAsRead(guideId) {
        // Store in localStorage that this guide has been read
        let readGuides = JSON.parse(localStorage.getItem('finFreeReadGuides')) || [];
        
        if (!readGuides.includes(guideId)) {
            readGuides.push(guideId);
            localStorage.setItem('finFreeReadGuides', JSON.stringify(readGuides));
            
            // Show success message
            this.showSuccess(`Great job completing the ${this.guides[guideId].title}!`);
        }
        
        FinFree.hideModal('guide-modal');
        this.updateGuidesList(); // Refresh to show completion status
    },

    // Check if guide is read
    isGuideRead(guideId) {
        const readGuides = JSON.parse(localStorage.getItem('finFreeReadGuides')) || [];
        return readGuides.includes(guideId);
    },

    // Show success message
    showSuccess(message) {
        // Create and show toast notification
        const toast = document.createElement('div');
        toast.className = 'toast success';
        toast.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
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
            box-shadow: var(--shadow-lg);
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
};

// Add custom styles for guides
const guidesStyles = document.createElement('style');
guidesStyles.textContent = `
    .guide-card {
        background: var(--surface-color);
        border-radius: var(--border-radius-lg);
        padding: 1.5rem;
        box-shadow: var(--shadow-md);
        transition: all 0.2s ease;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .guide-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg);
    }

    .guide-icon {
        font-size: 2.5rem;
        flex-shrink: 0;
    }

    .guide-info {
        flex-grow: 1;
    }

    .guide-info h3 {
        margin: 0 0 0.25rem 0;
        color: var(--text-primary);
        font-size: 1.25rem;
    }

    .guide-category {
        color: var(--text-secondary);
        margin: 0 0 0.5rem 0;
        font-size: 0.9rem;
    }

    .guide-meta {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .reading-time {
        color: var(--text-secondary);
        font-size: 0.85rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }

    .guide-arrow {
        color: var(--text-secondary);
        font-size: 1.2rem;
    }

    .guide-header {
        margin-bottom: 2rem;
    }

    .category-badge {
        background: var(--primary-color);
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;
    }

    .guide-introduction {
        font-size: 1.1rem;
        line-height: 1.6;
        color: var(--text-primary);
        margin-top: 1rem;
    }

    .guide-step {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
        padding: 1.5rem;
        background: var(--surface-color);
        border-radius: var(--border-radius-lg);
        border-left: 4px solid var(--primary-color);
    }

    .step-number {
        background: var(--primary-color);
        color: white;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        flex-shrink: 0;
    }

    .step-content h4 {
        margin: 0 0 0.5rem 0;
        color: var(--text-primary);
        font-size: 1.2rem;
    }

    .step-description {
        color: var(--text-secondary);
        margin-bottom: 1rem;
        font-style: italic;
    }

    .step-details {
        line-height: 1.6;
        margin-bottom: 1rem;
    }

    .step-tips {
        background: rgba(var(--warning-color-rgb), 0.1);
        padding: 1rem;
        border-radius: var(--border-radius);
        margin: 1rem 0;
    }

    .step-tips h5 {
        margin: 0 0 0.5rem 0;
        color: var(--warning-color);
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .step-tips ul {
        margin: 0;
        padding-left: 1.5rem;
    }

    .step-tips li {
        margin-bottom: 0.25rem;
    }

    .step-action {
        background: rgba(var(--primary-color-rgb), 0.1);
        padding: 0.75rem;
        border-radius: var(--border-radius);
        color: var(--primary-color);
        font-weight: 500;
        border-left: 3px solid var(--primary-color);
    }

    .guide-tools {
        margin: 2rem 0;
        padding: 1.5rem;
        background: var(--surface-color);
        border-radius: var(--border-radius-lg);
    }

    .guide-tools h4 {
        margin: 0 0 1rem 0;
        color: var(--text-primary);
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .tool-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: var(--bg-color);
        border-radius: var(--border-radius);
        margin-bottom: 0.5rem;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }

    .tool-item:hover {
        background: rgba(var(--primary-color-rgb), 0.05);
    }

    .tool-info h5 {
        margin: 0 0 0.25rem 0;
        color: var(--text-primary);
    }

    .tool-info p {
        margin: 0;
        color: var(--text-secondary);
        font-size: 0.9rem;
    }

    .guide-conclusion {
        background: rgba(var(--success-color-rgb), 0.1);
        padding: 1.5rem;
        border-radius: var(--border-radius-lg);
        margin: 2rem 0;
        border-left: 4px solid var(--success-color);
    }

    .conclusion-content h4 {
        margin: 0 0 0.5rem 0;
        color: var(--success-color);
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .conclusion-content p {
        margin: 0;
        line-height: 1.6;
    }

    .guide-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px solid var(--border-color);
    }

    @media (max-width: 768px) {
        .guide-card {
            padding: 1rem;
        }

        .guide-icon {
            font-size: 2rem;
        }

        .guide-step {
            flex-direction: column;
            gap: 0.5rem;
        }

        .step-number {
            align-self: flex-start;
        }

        .guide-actions {
            flex-direction: column;
        }

        .tool-item {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
        }
    }
`;
document.head.appendChild(guidesStyles);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    FinancialGuides.init();
});

// Make available globally
window.FinancialGuides = FinancialGuides;