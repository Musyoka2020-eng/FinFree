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
        pettyCash: 'components/sections/petty-cash.html'
        
        // Modal components (to be created later as needed)
        // expenseModal: 'components/modals/expense-form.html',
        // budgetModal: 'components/modals/budget-form.html',
        // incomeModal: 'components/modals/income-form.html',
        // goalModal: 'components/modals/goal-form.html',
        // guideModal: 'components/modals/guide-modal.html',
        // pettyCashModal: 'components/modals/petty-cash-form.html'
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
            target.innerHTML = html;
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
        if (typeof FinFree !== 'undefined' && FinFree.init) {
            FinFree.init();
        }
        
        // Integrate with FinFree navigation
        integrateWithFinFree();
    });
});

// Make ComponentLoader available globally for debugging
window.ComponentLoader = ComponentLoader;