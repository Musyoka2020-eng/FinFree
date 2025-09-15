// FinFree - Goals Tracking Module

// Goals management functionality
const GoalsManager = {
    // Initialize goals tracking
    init() {
        this.bindEvents();
    },

    // Bind event listeners for goals functionality
    bindEvents() {
        // Add goal button
        const addGoalBtn = document.getElementById('add-goal-btn');
        if (addGoalBtn) {
            addGoalBtn.addEventListener('click', () => {
                Modal.show('goal-form');
            });
        }

        // Close goal form
        const closeGoalForm = document.getElementById('close-goal-form');
        const cancelGoal = document.getElementById('cancel-goal');
        
        if (closeGoalForm) {
            closeGoalForm.addEventListener('click', () => {
                Modal.hide('goal-form');
            });
        }

        if (cancelGoal) {
            cancelGoal.addEventListener('click', () => {
                Modal.hide('goal-form');
            });
        }

        // Add goal form submission
        const addGoalForm = document.getElementById('add-goal-form');
        if (addGoalForm) {
            addGoalForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addGoal();
            });
        }

        // Close modal when clicking outside
        const goalModal = document.getElementById('goal-form');
        if (goalModal) {
            goalModal.addEventListener('click', (e) => {
                if (e.target === goalModal) {
                    Modal.hide('goal-form');
                }
            });
        }
    },

    // Add new goal
    addGoal() {
        const name = document.getElementById('goal-name').value.trim();
        const target = parseFloat(document.getElementById('goal-target').value);
        const current = parseFloat(document.getElementById('goal-current').value) || 0;
        const deadline = document.getElementById('goal-deadline').value;
        const category = document.getElementById('goal-category').value;

        // Validation
        if (!name) {
            this.showError('Please enter a goal name');
            return;
        }

        if (!target || target <= 0) {
            this.showError('Please enter a valid target amount');
            return;
        }

        if (current < 0) {
            this.showError('Current amount cannot be negative');
            return;
        }

        if (current > target) {
            this.showError('Current amount cannot exceed target amount');
            return;
        }

        if (!deadline) {
            this.showError('Please select a target date');
            return;
        }

        if (!category) {
            this.showError('Please select a category');
            return;
        }

        // Validate deadline is in the future
        const deadlineDate = new Date(deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (deadlineDate < today) {
            this.showError('Target date must be in the future');
            return;
        }

        // Create goal object
        const goal = {
            id: FinFree.generateId(),
            name: name,
            target: target,
            current: current,
            deadline: deadline,
            category: category,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            history: [{
                date: new Date().toISOString().split('T')[0],
                amount: current,
                action: 'created',
                note: 'Goal created'
            }]
        };

        // Add to data
        FinFree.data.goals.push(goal);
        FinFree.saveData();

        // Update UI
        FinFree.displayGoals();
        FinFree.updateDashboard();

        // Close modal and show success
        Modal.hide('goal-form');
        this.showSuccess(`Goal "${name}" created successfully!`);
    },

    // Update goal progress
    updateGoalProgress(goalId, newAmount, note = '') {
        const goal = FinFree.data.goals.find(g => g.id === goalId);
        if (!goal) {
            this.showError('Goal not found');
            return;
        }

        if (newAmount < 0) {
            this.showError('Amount cannot be negative');
            return;
        }

        if (newAmount > goal.target) {
            if (!confirm('The new amount exceeds the target. Do you want to continue?')) {
                return;
            }
        }

        const previousAmount = goal.current;
        const difference = newAmount - previousAmount;
        
        // Update goal
        goal.current = newAmount;
        goal.updatedAt = new Date().toISOString();

        // Add to history
        goal.history.push({
            date: new Date().toISOString().split('T')[0],
            amount: newAmount,
            difference: difference,
            action: difference > 0 ? 'contribution' : 'withdrawal',
            note: note || (difference > 0 ? 'Added funds' : 'Withdrew funds')
        });

        FinFree.saveData();
        FinFree.displayGoals();
        FinFree.updateDashboard();

        // Check if goal is completed
        if (newAmount >= goal.target && previousAmount < goal.target) {
            this.celebrateGoalCompletion(goal);
        }

        this.showSuccess(`Goal updated successfully! ${difference > 0 ? '+' : ''}${FinFree.formatCurrency(difference)}`);
    },

    // Delete goal
    deleteGoal(goalId) {
        const goal = FinFree.data.goals.find(g => g.id === goalId);
        if (!goal) return;

        if (confirm(`Are you sure you want to delete the goal "${goal.name}"?`)) {
            FinFree.data.goals = FinFree.data.goals.filter(g => g.id !== goalId);
            FinFree.saveData();
            FinFree.displayGoals();
            FinFree.updateDashboard();
            this.showSuccess('Goal deleted successfully!');
        }
    },

    // Celebrate goal completion
    celebrateGoalCompletion(goal) {
        const celebrationModal = document.createElement('div');
        celebrationModal.className = 'celebration-modal';
        celebrationModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 3000;
            animation: fadeIn 0.5s ease;
        `;

        celebrationModal.innerHTML = `
            <div style="
                background: white;
                padding: 2rem;
                border-radius: 1rem;
                text-align: center;
                max-width: 400px;
                animation: bounceIn 0.6s ease;
            ">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
                <h2 style="color: var(--success-color); margin-bottom: 1rem;">Goal Achieved!</h2>
                <p style="margin-bottom: 1rem; color: var(--text-primary);">
                    Congratulations! You've successfully reached your goal:
                </p>
                <h3 style="color: var(--primary-color); margin-bottom: 1rem;">${goal.name}</h3>
                <p style="margin-bottom: 2rem; color: var(--text-secondary);">
                    Target: ${FinFree.formatCurrency(goal.target)}
                </p>
                <button onclick="this.closest('.celebration-modal').remove()" style="
                    background: var(--success-color);
                    color: white;
                    border: none;
                    padding: 0.75rem 2rem;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    font-size: 1rem;
                ">Awesome!</button>
            </div>
        `;

        document.body.appendChild(celebrationModal);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (celebrationModal.parentElement) {
                celebrationModal.remove();
            }
        }, 10000);
    },

    // Calculate time to goal completion
    calculateTimeToGoal(goal) {
        if (goal.current >= goal.target) {
            return { completed: true };
        }

        const remaining = goal.target - goal.current;
        const deadlineDate = new Date(goal.deadline);
        const today = new Date();
        const daysLeft = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));

        if (daysLeft <= 0) {
            return { overdue: true, days: Math.abs(daysLeft) };
        }

        // Calculate required monthly savings
        const monthsLeft = Math.max(1, Math.ceil(daysLeft / 30));
        const requiredMonthly = remaining / monthsLeft;

        // Get average monthly contribution from history
        const contributions = goal.history
            .filter(h => h.action === 'contribution' && h.difference > 0)
            .slice(-6); // Last 6 contributions

        const avgContribution = contributions.length > 0 
            ? contributions.reduce((sum, c) => sum + c.difference, 0) / contributions.length
            : 0;

        return {
            daysLeft,
            monthsLeft,
            remaining,
            requiredMonthly,
            avgContribution,
            onTrack: avgContribution >= requiredMonthly * 0.8, // 80% of required is considered on track
            estimatedCompletion: avgContribution > 0 ? 
                Math.ceil(remaining / avgContribution) : null
        };
    },

    // Get goal statistics
    getGoalStats() {
        const goals = FinFree.data.goals;
        
        const stats = {
            total: goals.length,
            completed: goals.filter(g => g.current >= g.target).length,
            inProgress: goals.filter(g => g.current > 0 && g.current < g.target).length,
            notStarted: goals.filter(g => g.current === 0).length,
            overdue: 0,
            totalTargetAmount: goals.reduce((sum, g) => sum + g.target, 0),
            totalCurrentAmount: goals.reduce((sum, g) => sum + g.current, 0),
            categories: {}
        };

        // Count overdue goals
        const today = new Date();
        stats.overdue = goals.filter(g => {
            const deadline = new Date(g.deadline);
            return deadline < today && g.current < g.target;
        }).length;

        // Calculate category statistics
        const categories = ['emergency', 'vacation', 'car', 'house', 'investment', 'education', 'other'];
        categories.forEach(category => {
            const categoryGoals = goals.filter(g => g.category === category);
            stats.categories[category] = {
                count: categoryGoals.length,
                totalTarget: categoryGoals.reduce((sum, g) => sum + g.target, 0),
                totalCurrent: categoryGoals.reduce((sum, g) => sum + g.current, 0),
                completed: categoryGoals.filter(g => g.current >= g.target).length
            };
        });

        stats.completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
        stats.overallProgress = stats.totalTargetAmount > 0 ? 
            (stats.totalCurrentAmount / stats.totalTargetAmount) * 100 : 0;

        return stats;
    },

    // Get goals insights and recommendations
    getGoalInsights() {
        const goals = FinFree.data.goals;
        const insights = {
            recommendations: [],
            alerts: [],
            achievements: []
        };

        goals.forEach(goal => {
            const timeInfo = this.calculateTimeToGoal(goal);
            
            // Recommendations
            if (timeInfo.completed) {
                insights.achievements.push({
                    type: 'completed',
                    goalName: goal.name,
                    message: `Goal "${goal.name}" has been completed!`
                });
            } else if (timeInfo.overdue) {
                insights.alerts.push({
                    type: 'overdue',
                    goalName: goal.name,
                    message: `Goal "${goal.name}" is ${timeInfo.days} days overdue`,
                    action: 'Consider adjusting the target date or increasing contributions'
                });
            } else if (timeInfo.daysLeft <= 30) {
                insights.alerts.push({
                    type: 'urgent',
                    goalName: goal.name,
                    message: `Goal "${goal.name}" deadline is in ${timeInfo.daysLeft} days`,
                    action: `Need ${FinFree.formatCurrency(timeInfo.requiredMonthly)} monthly to achieve`
                });
            } else if (!timeInfo.onTrack) {
                insights.recommendations.push({
                    type: 'behind',
                    goalName: goal.name,
                    message: `You're behind on "${goal.name}"`,
                    action: `Increase monthly contribution to ${FinFree.formatCurrency(timeInfo.requiredMonthly)}`
                });
            } else if (timeInfo.onTrack) {
                insights.recommendations.push({
                    type: 'ontrack',
                    goalName: goal.name,
                    message: `Great progress on "${goal.name}"!`,
                    action: 'Keep up the current pace'
                });
            }
        });

        return insights;
    },

    // Generate goals report
    generateGoalsReport() {
        const stats = this.getGoalStats();
        const insights = this.getGoalInsights();
        
        const report = {
            generatedAt: new Date().toISOString(),
            summary: stats,
            insights: insights,
            goals: FinFree.data.goals.map(goal => ({
                ...goal,
                progress: (goal.current / goal.target) * 100,
                timeAnalysis: this.calculateTimeToGoal(goal)
            }))
        };

        return report;
    },

    // Export goals as CSV
    exportToCSV() {
        if (FinFree.data.goals.length === 0) {
            this.showError('No goals to export');
            return;
        }

        const headers = ['Name', 'Category', 'Target', 'Current', 'Progress %', 'Deadline', 'Status'];
        const csvContent = [
            headers.join(','),
            ...FinFree.data.goals.map(goal => {
                const progress = ((goal.current / goal.target) * 100).toFixed(1);
                const status = goal.current >= goal.target ? 'Completed' : 
                             new Date(goal.deadline) < new Date() ? 'Overdue' : 'In Progress';
                
                return [
                    `"${goal.name}"`,
                    goal.category,
                    goal.target,
                    goal.current,
                    progress,
                    goal.deadline,
                    status
                ].join(',');
            })
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'financial_goals.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        this.showSuccess('Goals exported successfully!');
    },

    // Create quick goal progress update interface
    showProgressUpdateModal(goalId) {
        const goal = FinFree.data.goals.find(g => g.id === goalId);
        if (!goal) return;

        const modal = document.createElement('div');
        modal.className = 'progress-update-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 3000;
        `;

        modal.innerHTML = `
            <div style="
                background: white;
                padding: 2rem;
                border-radius: 1rem;
                max-width: 400px;
                width: 100%;
                margin: 1rem;
            ">
                <h3 style="margin-bottom: 1rem; color: var(--text-primary);">Update Goal Progress</h3>
                <h4 style="margin-bottom: 1rem; color: var(--primary-color);">${goal.name}</h4>
                <p style="margin-bottom: 1rem; color: var(--text-secondary);">
                    Current: ${FinFree.formatCurrency(goal.current)} / ${FinFree.formatCurrency(goal.target)}
                </p>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">New Amount:</label>
                    <input type="number" id="new-amount" step="0.01" value="${goal.current}" 
                           style="width: 100%; padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 0.5rem;">
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Note (optional):</label>
                    <input type="text" id="progress-note" placeholder="e.g., Monthly contribution" 
                           style="width: 100%; padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 0.5rem;">
                </div>
                
                <div style="display: flex; gap: 1rem;">
                    <button onclick="this.closest('.progress-update-modal').remove()" 
                            style="flex: 1; padding: 0.75rem; background: var(--secondary-color); color: white; border: none; border-radius: 0.5rem; cursor: pointer;">
                        Cancel
                    </button>
                    <button onclick="GoalsManager.updateGoalFromModal('${goalId}', this)" 
                            style="flex: 1; padding: 0.75rem; background: var(--primary-color); color: white; border: none; border-radius: 0.5rem; cursor: pointer;">
                        Update
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.querySelector('#new-amount').focus();
    },

    // Update goal from modal
    updateGoalFromModal(goalId, button) {
        const modal = button.closest('.progress-update-modal');
        const newAmount = parseFloat(modal.querySelector('#new-amount').value);
        const note = modal.querySelector('#progress-note').value.trim();

        if (isNaN(newAmount)) {
            this.showError('Please enter a valid amount');
            return;
        }

        this.updateGoalProgress(goalId, newAmount, note);
        modal.remove();
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

// Add CSS for animations
const style = document.createElement('style');
style.textContent += `
@keyframes bounceIn {
    0% { transform: scale(0.3); opacity: 0; }
    50% { transform: scale(1.05); }
    70% { transform: scale(0.9); }
    100% { transform: scale(1); opacity: 1; }
}
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    GoalsManager.init();
});

// Make GoalsManager available globally
window.GoalsManager = GoalsManager;