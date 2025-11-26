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
                DashboardAPI.getUpcomingReminders().catch(() => [])
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

        if (balance) balance.textContent = DashboardUtils.formatCurrency(data.walletBalance || 0);
        if (change) {
            change.className = 'card-change positive';
            change.textContent = '+0% from last month';
        }
    },

    renderLoansCard(data) {
        const count = document.getElementById('activeLoansCount');
        const total = document.getElementById('activeLoansTotal');

        if (count) count.textContent = `${data.count} Loans`;
        if (total) total.textContent = `Total: ${DashboardUtils.formatCurrency(data.total)}`;
    },

    renderActivityCard(transactions) {
        const list = document.getElementById('activityList');
        if (!list) return;

        if (!transactions || transactions.length === 0) {
            list.innerHTML = '<div class="no-data">No recent activity</div>';
            return;
        }

        list.innerHTML = transactions.map(tx => {
            const isIncome = tx.amount > 0;
            return `
            <div class="activity-item">
                <i class="icon-${isIncome ? 'income' : 'outcome'}">
                    ${isIncome ? '📥' : '📤'}
                </i>
                <div class="activity-details">
                    <span class="activity-title">${tx.description || 'Transaction'}</span>
                    <span class="activity-date">${DashboardUtils.getRelativeTime(tx.transactionDate)}</span>
                </div>
                <span class="activity-amount ${isIncome ? 'positive' : 'negative'}">
                    ${isIncome ? '+' : ''}${DashboardUtils.formatCurrency(Math.abs(tx.amount))}
                </span>
            </div>
        `}).join('');
    },

    renderAlertCard(reminders) {
        const alertText = document.getElementById('alertText');

        if (!alertText) return;

        if (reminders && reminders.length > 0) {
            alertText.textContent = `You have ${reminders.length} loan payment(s) due soon`;
        } else {
            alertText.textContent = 'No upcoming payments';
        }
    }
};

window.DashboardStats = DashboardStats;