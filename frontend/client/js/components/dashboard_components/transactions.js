// /frontend/client/js/components/dashboard/transactions.js

const DashboardTransactions = {
    async init() {
        await this.loadData();
        this.attachEvents();
    },

    async loadData() {
        try {
            const transactions = await DashboardAPI.getRecentTransactions(5);
            this.renderTable(transactions);
        } catch (error) {
            console.error('Error loading transactions:', error);
        }
    },

    renderTable(transactions) {
        const tbody = document.getElementById('transactionsTableBody');
        if (!tbody) return;

        tbody.innerHTML = transactions.map(tx => {
            const amountClass = tx.amount > 0 ? 'positive' : 'negative';
            const amountSign = tx.amount > 0 ? '+' : '';

            return `
                <tr>
                    <td>${DashboardUtils.formatDate(tx.date)}</td>
                    <td><span class="type-badge ${tx.type}">${DashboardUtils.capitalize(tx.type)}</span></td>
                    <td>${tx.description}</td>
                    <td class="amount ${amountClass}">
                        ${amountSign}${DashboardUtils.formatCurrency(Math.abs(tx.amount))}
                    </td>
                    <td><span class="status-badge ${tx.status}">${DashboardUtils.capitalize(tx.status)}</span></td>
                </tr>
            `;
        }).join('');
    },

    attachEvents() {
        const viewAllBtn = document.getElementById('viewAllTransactionsBtn');
        if (viewAllBtn) {
            viewAllBtn.addEventListener('click', () => {
                window.location.hash = '#/transactions';
            });
        }
    }
};

window.DashboardTransactions = DashboardTransactions;