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
            const tbody = document.getElementById('transactionsTableBody');
            if (tbody) tbody.innerHTML = '<tr><td colspan="5">No transactions found</td></tr>';
        }
    },

    renderTable(transactions) {
        const tbody = document.getElementById('transactionsTableBody');
        if (!tbody) return;

        if (!transactions || transactions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">No transactions found</td></tr>';
            return;
        }

        tbody.innerHTML = transactions.map(tx => {
            const amountClass = tx.amount > 0 ? 'positive' : 'negative';
            const amountSign = tx.amount > 0 ? '+' : '';

            return `
                <tr>
                    <td>${DashboardUtils.formatDate(tx.transactionDate)}</td>
                    <td><span class="type-badge ${tx.transactionType}">${DashboardUtils.capitalize(tx.transactionType || 'payment')}</span></td>
                    <td>${tx.description || 'Transaction'}</td>
                    <td class="amount ${amountClass}">
                        ${amountSign}${DashboardUtils.formatCurrency(Math.abs(tx.amount))}
                    </td>
                    <td><span class="status-badge ${tx.status}">${DashboardUtils.capitalize(tx.status || 'pending')}</span></td>
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