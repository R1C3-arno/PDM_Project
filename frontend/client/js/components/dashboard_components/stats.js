// /frontend/client/js/components/dashboard/stats.js

const DashboardStats = {
    async init() {
        await this.loadData();
    },

    async loadData() {
        try {
            const [walletStats, activeLoans, recentActivity, reminders] = await Promise.all([
                DashboardAPI.getWalletStats(),
                DashboardAPI.getActiveLoans(),
                DashboardAPI.getRecentTransactions(3),
                DashboardAPI.getUpcomingReminders()
            ]);

            this.renderBalanceCard(walletStats);
            this.renderLoansCard(activeLoans);
            this.renderActivityCard(recentActivity);
            this.renderAlertCard(reminders);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    },

    renderBalanceCard(data) {
        const balance = document.getElementById('cardBalance');
        const change = document.getElementById('balanceChange');

        if (balance) balance.textContent = DashboardUtils.formatCurrency(data.balance);
        if (change && data.changePercent) {
            const isPositive = data.changePercent >= 0;
            change.className = `card-change ${isPositive ? 'positive' : 'negative'}`;
            change.textContent = `${isPositive ? '+' : ''}${data.changePercent}% from last month`;
        }
    },

    renderLoansCard(data) {
        const count = document.getElementById('activeLoansCount');
        const total = document.getElementById('activeLoansTotal');

        if (count) count.textContent = `${data.count} Loans`;
        if (total) total.textContent = `Total: ${DashboardUtils.formatCurrency(data.total)}`;
    },

    renderActivityCard(activities) {
        const list = document.getElementById('activityList');
        if (!list) return;

        list.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <i class="icon-${activity.type === 'income' ? 'income' : 'outcome'}">
                    ${activity.type === 'income' ? '📥' : '📤'}
                </i>
                <div class="activity-details">
                    <span class="activity-title">${activity.title}</span>
                    <span class="activity-date">${DashboardUtils.getRelativeTime(activity.date)}</span>
                </div>
                <span class="activity-amount ${activity.amount > 0 ? 'positive' : 'negative'}">
                    ${activity.amount > 0 ? '+' : ''}${DashboardUtils.formatCurrency(Math.abs(activity.amount))}
                </span>
            </div>
        `).join('');
    },

    renderAlertCard(reminders) {
        const alertText = document.getElementById('alertText');

        if (!alertText) return;

        if (reminders && reminders.length > 0) {
            const next = reminders[0];
            alertText.textContent = `You have ${reminders.length} loan payment(s) due soon`;
        } else {
            alertText.textContent = 'No upcoming payments';
        }
    }
};

window.DashboardStats = DashboardStats;