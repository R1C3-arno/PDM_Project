const MyWallet = {
    async init() {
        await this.loadData();
    },

    async loadData() {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.id) {
                alert('Please login first!');
                window.location.href = '/frontend/client/pages/Authentication/index.html';
                return;
            }

            const [wallet, transactions] = await Promise.all([
                this.getWalletData(user.id),
                this.getTransactions(user.id)
            ]);

            this.renderWallet(wallet);
            this.renderTransactions(transactions);
        } catch (error) {
            console.error('Error loading wallet data:', error);
        }
    },

    async getWalletData(userId) {
        const response = await fetch(`http://localhost:8080/api/wallets/user/${userId}`);
        return await response.json();
    },

    async getTransactions(userId) {
        const response = await fetch(`http://localhost:8080/api/transactions/recent?userId=${userId}&limit=10`);
        return await response.json();
    },

    renderWallet(wallet) {
        if (!wallet) {
            document.getElementById('totalBalance').textContent = '$0.00';
            document.getElementById('availableCredit').textContent = '$0.00';
            document.getElementById('totalBorrowed').textContent = '$0.00';
            document.getElementById('totalRepaid').textContent = '$0.00';
            return;
        }

        document.getElementById('totalBalance').textContent = this.formatCurrency(wallet.balance || 0);
        document.getElementById('availableCredit').textContent = this.formatCurrency(wallet.availableCredit || 0);
        document.getElementById('totalBorrowed').textContent = this.formatCurrency(wallet.totalBorrowed || 0);
        document.getElementById('totalRepaid').textContent = this.formatCurrency(wallet.totalRepaid || 0);
    },

    renderTransactions(transactions) {
        const container = document.getElementById('transactionsList');
        if (!container) return;

        if (!transactions || transactions.length === 0) {
            container.innerHTML = '<p style="text-align: center; padding: 2rem; color: #999;">No transactions yet</p>';
            return;
        }

        container.innerHTML = transactions.map(tx => {
            const isPositive = tx.amount > 0;
            const iconClass = isPositive ? 'in' : 'out';
            const amountClass = isPositive ? 'positive' : 'negative';
            const amountSign = isPositive ? '+' : '';

            return `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-icon ${iconClass}">
                        <i class="ri-arrow-${isPositive ? 'down' : 'up'}-line"></i>
                    </div>
                    <div class="transaction-details">
                        <h4>${tx.description || 'Transaction'}</h4>
                        <p>${this.formatDate(tx.transactionDate)}</p>
                    </div>
                </div>
                <div class="transaction-amount ${amountClass}">
                    ${amountSign}${this.formatCurrency(Math.abs(tx.amount))}
                </div>
            </div>
            `;
        }).join('');
    },

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }) + ' - ' + date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => MyWallet.init());
} else {
    MyWallet.init();
}

window.MyWallet = MyWallet;