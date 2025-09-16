// FinFree - Firebase Integration Module

// Firebase configuration and integration
const FirebaseIntegration = {
    // Firebase app instance
    app: null,
    db: null,
    auth: null,

    // Configuration state
    isConfigured: false,
    isConnected: false,
    currentUser: null,

    // Initialize Firebase with configuration
    async init(config = null) {
        try {
            // Use provided config or check for stored config
            const firebaseConfig = config || this.getStoredConfig();
            
            if (!firebaseConfig || !firebaseConfig.apiKey) {
                console.log('Firebase not configured. Using localStorage only.');
                return false;
            }

            // Import Firebase modules
            const { initializeApp } = await import('https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js');
            const { getFirestore, connectFirestoreEmulator } = await import('https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js');
            const { getAuth, connectAuthEmulator } = await import('https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js');

            // Initialize Firebase
            this.app = initializeApp(firebaseConfig);
            this.db = getFirestore(this.app);
            this.auth = getAuth(this.app);

            // Set up auth state listener
            this.setupAuthListener();

            this.isConfigured = true;
            this.isConnected = true;

            console.log('Firebase initialized successfully');
            return true;

        } catch (error) {
            console.error('Firebase initialization error:', error);
            this.isConfigured = false;
            this.isConnected = false;
            return false;
        }
    },

    // Get stored Firebase configuration
    getStoredConfig() {
        try {
            const stored = localStorage.getItem('finFreeFirebaseConfig');
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error('Error retrieving Firebase config:', error);
            return null;
        }
    },

    // Store Firebase configuration
    storeConfig(config) {
        try {
            localStorage.setItem('finFreeFirebaseConfig', JSON.stringify(config));
            return true;
        } catch (error) {
            console.error('Error storing Firebase config:', error);
            return false;
        }
    },

    // Configure Firebase with user-provided settings
    async configure(config) {
        if (!config.apiKey || !config.authDomain || !config.projectId) {
            throw new Error('Missing required Firebase configuration fields');
        }

        // Store the configuration
        this.storeConfig(config);

        // Initialize with new configuration
        return await this.init(config);
    },

    // Set up authentication state listener
    setupAuthListener() {
        if (!this.auth) return;

        this.auth.onAuthStateChanged((user) => {
            this.currentUser = user;
            
            if (user) {
                console.log('User signed in:', user.email);
                this.onUserSignedIn(user);
            } else {
                console.log('User signed out');
                this.onUserSignedOut();
            }
        });
    },

    // Handle user sign in
    onUserSignedIn(user) {
        // Sync local data to Firebase
        this.syncDataToFirebase();
        
        // Update UI to show user is signed in
        this.updateUIForSignedInUser(user);
    },

    // Handle user sign out
    onUserSignedOut() {
        // Update UI to show user is signed out
        this.updateUIForSignedOutUser();
    },

    // Sign in with email and password
    async signIn(email, password) {
        if (!this.auth) {
            throw new Error('Firebase not configured');
        }

        try {
            const { signInWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js');
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            return userCredential.user;
        } catch (error) {
            console.error('Sign in error:', error);
            throw error;
        }
    },

    // Create account with email and password
    async signUp(email, password) {
        if (!this.auth) {
            throw new Error('Firebase not configured');
        }

        try {
            const { createUserWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js');
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            return userCredential.user;
        } catch (error) {
            console.error('Sign up error:', error);
            throw error;
        }
    },

    // Sign out
    async signOut() {
        if (!this.auth) {
            throw new Error('Firebase not configured');
        }

        try {
            await this.auth.signOut();
        } catch (error) {
            console.error('Sign out error:', error);
            throw error;
        }
    },

    // Sync local data to Firebase
    async syncDataToFirebase() {
        if (!this.db || !this.currentUser) return;

        try {
            const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js');
            
            const userDataRef = doc(this.db, 'users', this.currentUser.uid);
            
            // Get current local data
            const localData = {
                expenses: FinFree.data.expenses,
                income: FinFree.data.income,
                goals: FinFree.data.goals,
                budgets: FinFree.data.budgets,
                pettyCash: FinFree.data.pettyCash,
                settings: FinFree.data.settings,
                lastSync: new Date().toISOString()
            };

            await setDoc(userDataRef, localData, { merge: true });
            console.log('Data synced to Firebase successfully');
            
        } catch (error) {
            console.error('Error syncing data to Firebase:', error);
        }
    },

    // Load data from Firebase
    async loadDataFromFirebase() {
        if (!this.db || !this.currentUser) return null;

        try {
            const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js');
            
            const userDataRef = doc(this.db, 'users', this.currentUser.uid);
            const docSnap = await getDoc(userDataRef);
            
            if (docSnap.exists()) {
                const firebaseData = docSnap.data();
                console.log('Data loaded from Firebase successfully');
                return firebaseData;
            } else {
                console.log('No data found in Firebase');
                return null;
            }
            
        } catch (error) {
            console.error('Error loading data from Firebase:', error);
            return null;
        }
    },

    // Merge Firebase data with local data
    async mergeData() {
        const firebaseData = await this.loadDataFromFirebase();
        if (!firebaseData) return;

        // Merge strategies for different data types
        const mergeStrategies = {
            expenses: (local, remote) => this.mergeArraysByTimestamp(local, remote),
            income: (local, remote) => this.mergeArraysByTimestamp(local, remote),
            goals: (local, remote) => this.mergeArraysByTimestamp(local, remote),
            pettyCash: (local, remote) => this.mergeArraysByTimestamp(local, remote),
            budgets: (local, remote) => ({ ...local, ...remote }),
            settings: (local, remote) => ({ ...local, ...remote })
        };

        // Merge each data type
        for (const [key, mergeFunction] of Object.entries(mergeStrategies)) {
            if (firebaseData[key]) {
                FinFree.data[key] = mergeFunction(FinFree.data[key] || [], firebaseData[key]);
            }
        }

        // Save merged data locally
        FinFree.saveData();
        
        // Update UI
        FinFree.updateDashboard();
    },

    // Merge arrays by timestamp (keep most recent)
    mergeArraysByTimestamp(localArray, remoteArray) {
        const merged = [...localArray];
        const localIds = new Set(localArray.map(item => item.id));

        remoteArray.forEach(remoteItem => {
            if (!localIds.has(remoteItem.id)) {
                merged.push(remoteItem);
            } else {
                // Replace if remote is more recent
                const localIndex = merged.findIndex(item => item.id === remoteItem.id);
                const localTimestamp = new Date(merged[localIndex].timestamp || 0);
                const remoteTimestamp = new Date(remoteItem.timestamp || 0);
                
                if (remoteTimestamp > localTimestamp) {
                    merged[localIndex] = remoteItem;
                }
            }
        });

        return merged;
    },

    // Update UI for signed in user
    updateUIForSignedInUser(user) {
        // Show user info in navigation or settings
        const userInfo = document.getElementById('user-info');
        if (userInfo) {
            userInfo.innerHTML = `
                <div class="user-profile">
                    <span class="user-email">${user.email}</span>
                    <button class="btn btn-sm btn-secondary" onclick="FirebaseIntegration.signOut()">
                        Sign Out
                    </button>
                </div>
            `;
        }

        // Show sync status
        this.showSyncStatus('connected');
    },

    // Update UI for signed out user
    updateUIForSignedOutUser() {
        const userInfo = document.getElementById('user-info');
        if (userInfo) {
            userInfo.innerHTML = `
                <button class="btn btn-primary btn-sm" onclick="FirebaseIntegration.showAuthModal()">
                    Sign In / Sign Up
                </button>
            `;
        }

        this.showSyncStatus('disconnected');
    },

    // Show authentication modal
    showAuthModal() {
        // Create auth modal if it doesn't exist
        if (!document.getElementById('auth-modal')) {
            this.createAuthModal();
        }
        
        FinFree.showModal('auth-modal');
    },

    // Create authentication modal
    createAuthModal() {
        const modalHTML = `
            <div id="auth-modal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Sign In to FinFree</h3>
                        <button class="btn-close" onclick="FinFree.hideModal('auth-modal')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="auth-tabs">
                            <button class="tab-btn active" onclick="FirebaseIntegration.switchAuthTab('signin')">Sign In</button>
                            <button class="tab-btn" onclick="FirebaseIntegration.switchAuthTab('signup')">Sign Up</button>
                            <button class="tab-btn" onclick="FirebaseIntegration.switchAuthTab('config')">Configure</button>
                        </div>
                        
                        <div id="auth-signin" class="auth-form active">
                            <form id="signin-form">
                                <div class="form-group">
                                    <label for="signin-email">Email</label>
                                    <input type="email" id="signin-email" required>
                                </div>
                                <div class="form-group">
                                    <label for="signin-password">Password</label>
                                    <input type="password" id="signin-password" required>
                                </div>
                                <button type="submit" class="btn btn-primary">Sign In</button>
                            </form>
                        </div>
                        
                        <div id="auth-signup" class="auth-form">
                            <form id="signup-form">
                                <div class="form-group">
                                    <label for="signup-email">Email</label>
                                    <input type="email" id="signup-email" required>
                                </div>
                                <div class="form-group">
                                    <label for="signup-password">Password</label>
                                    <input type="password" id="signup-password" required>
                                </div>
                                <div class="form-group">
                                    <label for="signup-confirm">Confirm Password</label>
                                    <input type="password" id="signup-confirm" required>
                                </div>
                                <button type="submit" class="btn btn-primary">Sign Up</button>
                            </form>
                        </div>
                        
                        <div id="auth-config" class="auth-form">
                            <p>To use cloud sync, configure your Firebase project:</p>
                            <form id="config-form">
                                <div class="form-group">
                                    <label for="config-apikey">API Key</label>
                                    <input type="text" id="config-apikey" required>
                                </div>
                                <div class="form-group">
                                    <label for="config-authdomain">Auth Domain</label>
                                    <input type="text" id="config-authdomain" required>
                                </div>
                                <div class="form-group">
                                    <label for="config-projectid">Project ID</label>
                                    <input type="text" id="config-projectid" required>
                                </div>
                                <button type="submit" class="btn btn-primary">Configure Firebase</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.bindAuthEvents();
    },

    // Bind authentication events
    bindAuthEvents() {
        // Sign in form
        const signinForm = document.getElementById('signin-form');
        if (signinForm) {
            signinForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('signin-email').value;
                const password = document.getElementById('signin-password').value;
                
                try {
                    await this.signIn(email, password);
                    FinFree.hideModal('auth-modal');
                } catch (error) {
                    this.showError('Sign in failed: ' + error.message);
                }
            });
        }

        // Sign up form
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('signup-email').value;
                const password = document.getElementById('signup-password').value;
                const confirm = document.getElementById('signup-confirm').value;
                
                if (password !== confirm) {
                    this.showError('Passwords do not match');
                    return;
                }
                
                try {
                    await this.signUp(email, password);
                    FinFree.hideModal('auth-modal');
                } catch (error) {
                    this.showError('Sign up failed: ' + error.message);
                }
            });
        }

        // Configuration form
        const configForm = document.getElementById('config-form');
        if (configForm) {
            configForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const config = {
                    apiKey: document.getElementById('config-apikey').value,
                    authDomain: document.getElementById('config-authdomain').value,
                    projectId: document.getElementById('config-projectid').value
                };
                
                try {
                    await this.configure(config);
                    FinFree.hideModal('auth-modal');
                    this.showSuccess('Firebase configured successfully!');
                } catch (error) {
                    this.showError('Configuration failed: ' + error.message);
                }
            });
        }
    },

    // Switch authentication tabs
    switchAuthTab(tab) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        // Update forms
        document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
        document.getElementById(`auth-${tab}`).classList.add('active');
    },

    // Show sync status
    showSyncStatus(status) {
        const syncStatus = document.getElementById('sync-status');
        if (syncStatus) {
            const statusIcon = status === 'connected' ? 'check-circle' : 'exclamation-triangle';
            const statusText = status === 'connected' ? 'Synced' : 'Local Only';
            const statusColor = status === 'connected' ? 'var(--success-color)' : 'var(--warning-color)';
            
            syncStatus.innerHTML = `
                <i class="fas fa-${statusIcon}" style="color: ${statusColor}"></i>
                <span>${statusText}</span>
            `;
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

// Auto-initialize Firebase on DOM load
document.addEventListener('DOMContentLoaded', () => {
    FirebaseIntegration.init();
});

// Make available globally
window.FirebaseIntegration = FirebaseIntegration;