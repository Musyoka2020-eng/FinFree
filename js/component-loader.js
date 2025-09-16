// Component Loader System for FinFree

const ComponentLoader = {
    // Cache for loaded components
    cache: new Map(),
    
    // Component configuration - now including all created components
    components: {
        // Layout components
        sidebar: 'components/layout/sidebar.html',
        navbar: 'components/layout/navbar.html',
        
        // Section components
        dashboard: 'components/sections/dashboard.html',
        expenses: 'components/sections/expenses.html',
        budget: 'components/sections/budget.html',
        earnings: 'components/sections/earnings.html',
        goals: 'components/sections/goals.html',
        calculators: 'components/sections/calculators.html',
        guides: 'components/sections/guides.html',
        spendingPlan: 'components/sections/spending-plan.html',
        pettyCash: 'components/sections/petty-cash.html',
        
        // Modal components
        expenseForm: 'components/modals/expense-form.html',
        budgetForm: 'components/modals/budget-form.html',
        incomeForm: 'components/modals/income-form.html',
        goalForm: 'components/modals/goal-form.html',
        pettyCashForm: 'components/modals/petty-cash-form.html',
        guideModal: 'components/modals/guide-modal.html'
    },

    // Load a single component
    async loadComponent(name) {
        // Return from cache if already loaded
        if (this.cache.has(name)) {
            return this.cache.get(name);
        }

        const path = this.components[name];
        if (!path) {
            throw new Error(`Component '${name}' not found`);
        }

        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Failed to load component: ${response.statusText}`);
            }
            
            const html = await response.text();
            
            // Cache the component
            this.cache.set(name, html);
            
            return html;
        } catch (error) {
            console.error(`Error loading component '${name}':`, error);
            return `<!-- Error loading component: ${name} -->`;
        }
    },

    // Load multiple components in parallel
    async loadComponents(names) {
        const promises = names.map(name => this.loadComponent(name));
        return await Promise.all(promises);
    },

    // Inject component into DOM
    async injectComponent(name, targetSelector) {
        const html = await this.loadComponent(name);
        const target = document.querySelector(targetSelector);
        
        if (target) {
            // For modal container, append instead of replace
            if (targetSelector === '#modal-container') {
                target.insertAdjacentHTML('beforeend', html);
            } else {
                target.innerHTML = html;
            }
        } else {
            console.error(`Target element '${targetSelector}' not found`);
        }
    },

    // Replace element with component
    async replaceWithComponent(name, targetSelector) {
        const html = await this.loadComponent(name);
        const target = document.querySelector(targetSelector);
        
        if (target) {
            target.outerHTML = html;
        } else {
            console.error(`Target element '${targetSelector}' not found`);
        }
    },

    // Append component to target
    async appendComponent(name, targetSelector) {
        const html = await this.loadComponent(name);
        const target = document.querySelector(targetSelector);
        
        if (target) {
            target.insertAdjacentHTML('beforeend', html);
        } else {
            console.error(`Target element '${targetSelector}' not found`);
        }
    },

    // Prepend component to target  
    async prependComponent(name, targetSelector) {
        const html = await this.loadComponent(name);
        const target = document.querySelector(targetSelector);
        
        if (target) {
            target.insertAdjacentHTML('afterbegin', html);
        } else {
            console.error(`Target element '${targetSelector}' not found`);
        }
    },

    // Initialize the app by loading core components
    async initializeApp() {
        try {
            console.log('Loading application components...');
            
            // Load layout components first
            await this.replaceWithComponent('sidebar', '.sidebar-placeholder');
            await this.replaceWithComponent('navbar', '.navbar-placeholder');
            
            // Load initial dashboard section
            await this.injectComponent('dashboard', '#main-sections');
            
            // Initialize sidebar interactions
            this.initializeSidebarInteractions();
            
            console.log('Application components loaded successfully');
            
        } catch (error) {
            console.error('Error initializing app components:', error);
        }
    },

    // Lazy load a section when needed
    async loadSection(sectionName) {
        const target = document.getElementById('main-sections');
        if (!target) {
            console.error('Main sections container not found');
            return;
        }

        // Clear existing content
        target.innerHTML = '';
        
        // Load the requested section
        await this.injectComponent(sectionName, '#main-sections');
    },

    // Load a modal component and inject it
    async loadModal(modalName) {
        console.log('ComponentLoader.loadModal called with:', modalName);
        
        // Map modal names to component names
        const modalMap = {
            'expense-form': 'expenseForm',
            'budget-form': 'budgetForm',
            'income-form': 'incomeForm',
            'goal-form': 'goalForm',
            'petty-cash-form': 'pettyCashForm',
            'guide-modal': 'guideModal'
        };
        
        const componentName = modalMap[modalName] || modalName;
        console.log('Mapped to component name:', componentName);
        
        // Check if modal is already loaded
        const existingModal = document.getElementById(modalName);
        console.log('Existing modal found:', existingModal !== null);
        if (existingModal) {
            return; // Modal already exists
        }
        
        // Load the requested modal into the modal container
        console.log('Injecting component into #modal-container');
        const modalContainer = document.getElementById('modal-container');
        console.log('Modal container found:', modalContainer !== null);
        await this.injectComponent(componentName, '#modal-container');
        console.log('Component injection completed');
    },

    // Register a new component
    registerComponent(name, path) {
        this.components[name] = path;
    },

    // Clear component cache (useful for development)
    clearCache() {
        this.cache.clear();
    },

    // Get cache status
    getCacheStatus() {
        return {
            size: this.cache.size,
            components: Array.from(this.cache.keys())
        };
    },

    // Initialize sidebar interactions
    initializeSidebarInteractions() {
        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebar-overlay');
        
        if (mobileMenuToggle && sidebar) {
            mobileMenuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
                sidebarOverlay.classList.toggle('active');
            });
        }
        
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', () => {
                sidebar.classList.remove('active');
                sidebarOverlay.classList.remove('active');
            });
        }

        // Sidebar navigation links
        const navLinks = document.querySelectorAll('.sidebar .nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionName = link.getAttribute('data-section');
                if (sectionName && typeof FinFree !== 'undefined') {
                    FinFree.showSection(sectionName);
                    
                    // Close mobile sidebar after navigation
                    if (window.innerWidth <= 768) {
                        sidebar.classList.remove('active');
                        sidebarOverlay.classList.remove('active');
                    }
                }
            });
        });

        // Update page title based on active section
        this.updatePageTitle();
    },

    // Update page title in top bar
    updatePageTitle() {
        const activeLink = document.querySelector('.sidebar .nav-link.active');
        const pageTitle = document.getElementById('current-page-title');
        
        if (activeLink && pageTitle) {
            const sectionName = activeLink.querySelector('.nav-text')?.textContent || 'Dashboard';
            pageTitle.textContent = sectionName;
        }
    },

    // Initialize section-specific JavaScript after component loads
    initializeSectionJS(sectionName) {
        // Re-bind any section-specific event listeners that might be needed
        switch(sectionName) {
            case 'expenses':
                this.initializeExpensesJS();
                break;
            case 'budget':
                this.initializeBudgetJS();
                break;
            case 'earnings':
                this.initializeEarningsJS();
                break;
            case 'petty-cash':
            case 'pettyCash':
                this.initializePettyCashJS();
                break;
            case 'goals':
                this.initializeGoalsJS();
                break;
            case 'calculators':
                this.initializeCalculatorsJS();
                break;
            case 'guides':
                this.initializeGuidesJS();
                break;
            case 'spending-plan':
            case 'spendingPlan':
                this.initializeSpendingPlanJS();
                break;
        }
    },

    // Initialize expenses section JavaScript
    initializeExpensesJS() {
        const categoryFilter = document.getElementById('expense-category-filter');
        const dateFilter = document.getElementById('expense-date-filter');
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                if (typeof FinFree !== 'undefined') {
                    FinFree.displayExpenses();
                }
            });
        }

        if (dateFilter) {
            dateFilter.addEventListener('change', () => {
                if (typeof FinFree !== 'undefined') {
                    FinFree.displayExpenses();
                }
            });
        }
    },

    // Initialize other sections (placeholder methods)
    initializeBudgetJS() {
        // Add budget-specific event listeners here
    },

    initializeEarningsJS() {
        // Add earnings-specific event listeners here
        const periodFilter = document.getElementById('income-period-filter');
        const sourceFilter = document.getElementById('income-source-filter');
        
        if (periodFilter) {
            periodFilter.addEventListener('change', () => {
                if (typeof FinFree !== 'undefined') {
                    FinFree.displayIncome();
                }
            });
        }

        if (sourceFilter) {
            sourceFilter.addEventListener('change', () => {
                if (typeof FinFree !== 'undefined') {
                    FinFree.displayIncome();
                }
            });
        }
    },

    initializePettyCashJS() {
        // Add petty cash-specific event listeners here
        const periodFilter = document.getElementById('cash-period-filter');
        const typeFilter = document.getElementById('cash-type-filter');
        
        if (periodFilter) {
            periodFilter.addEventListener('change', () => {
                if (typeof FinFree !== 'undefined') {
                    FinFree.updatePettyCashDisplay();
                }
            });
        }

        if (typeFilter) {
            typeFilter.addEventListener('change', () => {
                if (typeof FinFree !== 'undefined') {
                    FinFree.updatePettyCashDisplay();
                }
            });
        }
    },

    initializeGoalsJS() {
        // Add goals-specific event listeners here
    },

    initializeCalculatorsJS() {
        // Initialize FinancialCalculators module
        if (typeof FinancialCalculators !== 'undefined') {
            FinancialCalculators.init();
        }
    },

    initializeGuidesJS() {
        // Add guides-specific event listeners here
        if (typeof Guides !== 'undefined') {
            Guides.init();
        }
    },

    initializeSpendingPlanJS() {
        // Add spending plan-specific event listeners here
        if (typeof ConsciousSpending !== 'undefined') {
            ConsciousSpending.init();
        }
    }
};

// Integration with existing FinFree navigation system
let OriginalFinFreeShowSection = null;

// Map section names from navigation to component names
const sectionNameMap = {
    'spending-plan': 'spendingPlan',
    'petty-cash': 'pettyCash'
};

// Override FinFree.showSection to use component loader
function integrateWithFinFree() {
    if (typeof FinFree !== 'undefined' && FinFree.showSection) {
        OriginalFinFreeShowSection = FinFree.showSection;
        
        FinFree.showSection = async function(sectionName) {
            // Hide all existing sections first
            const sections = document.querySelectorAll('.section');
            sections.forEach(section => {
                section.classList.remove('active');
            });

            // Update navigation in sidebar
            const navLinks = document.querySelectorAll('.sidebar .nav-link');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-section') === sectionName) {
                    link.classList.add('active');
                }
            });

            // Update page title
            ComponentLoader.updatePageTitle();

            try {
                // Map section name to component name
                const componentName = sectionNameMap[sectionName] || sectionName;
                
                // Load section component if it exists
                if (ComponentLoader.components[componentName]) {
                    await ComponentLoader.loadSection(componentName);
                    
                    // Show the loaded section
                    const loadedSection = document.getElementById(sectionName);
                    if (loadedSection) {
                        loadedSection.classList.add('active');
                    }

                    // Call original section update logic
                    if (OriginalFinFreeShowSection) {
                        // Extract just the update logic from original showSection
                        FinFree.updateSectionContent(sectionName);
                    }

                    // Initialize section-specific JavaScript after component loads
                    ComponentLoader.initializeSectionJS(sectionName);
                } else {
                    // Fall back to original implementation for sections not yet componentized
                    if (OriginalFinFreeShowSection) {
                        OriginalFinFreeShowSection.call(this, sectionName);
                    } else {
                        // Basic fallback
                        const section = document.getElementById(sectionName);
                        if (section) {
                            section.classList.add('active');
                        }
                    }
                }
            } catch (error) {
                console.error(`Error loading section '${sectionName}':`, error);
            }
        };
    }
}

// Auto-initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize component system first, then FinFree
    ComponentLoader.initializeApp().then(() => {
        // Initialize FinFree app after components are loaded
        if (typeof FinFree !== 'undefined') {
            if (FinFree.init) {
                FinFree.init();
            }
            // Initialize events after components are ready
            if (FinFree.initializeEvents) {
                FinFree.initializeEvents();
            }
        }
        
        // Integrate with FinFree navigation
        integrateWithFinFree();
    }).catch(error => {
        console.error('Failed to initialize app components:', error);
    });
});

// Make ComponentLoader available globally for debugging
window.ComponentLoader = ComponentLoader;