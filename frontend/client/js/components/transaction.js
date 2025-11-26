const Transactions = {
    currentType: 'all',
    userId: null,

    async init() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) {
            alert('Please login first!');
            window.location.href = '/frontend/client/pages/Authentication/index.html';
            return;
        }

        this.userId = user.id;
        await this.loadData();
        this.attachEvents();
    },

    async loadData() {
        try {
            const transactions = await this.getTransactions(this.userId, this.currentType);
            this.renderTable(transactions);
        } catch (error) {
            console.error('Error loading transactions:', error);
            this.renderEmpty();
        }
    },

    async getTransactions(userId, type) {
        const url = type && type !== 'all'
            ? `http://localhost:8080/api/transactions/user/${userId}?type=${type}&limit=50`
            : `http://localhost:8080/api/transactions/user/${userId}?limit=50`;

        const response = await fetch(url);
        return await response.json();
    },

    renderTable(transactions) {
        const tbody = document.getElementById('transactionsTableBody');
        if (!tbody) return;

        if (!transactions || transactions.length === 0) {
            this.renderEmpty();
            return;
        }

        tbody.innerHTML = transactions.map(tx => {
            const isPositive = tx.amount > 0;
            const typeInfo = this.getTypeInfo(tx.transactionType, isPositive);

            return `
                <tr>
                    <td>#TXN${String(tx.id).padStart(6, '0')}</td>
                    <td>
                        <span class="type-badge ${typeInfo.class}">
                            <i class="${typeInfo.icon}"></i>
                            ${typeInfo.label}
                        </span>
                    </td>
                    <td>${tx.description || 'Transaction'}</td>
                    <td>${this.formatDateTime(tx.transactionDate)}</td>
                    <td class="${isPositive ? 'amount-positive' : 'amount-negative'}">
                        ${isPositive ? '+' : ''}${this.formatCurrency(tx.amount)}
                    </td>
                    <td>
                        <span class="status ${tx.status || 'completed'}">${this.capitalize(tx.status || 'completed')}</span>
                    </td>
                </tr>
            `;
        }).join('');
    },

    renderEmpty() {
        const tbody = document.getElementById('transactionsTableBody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: #999;">No transactions found</td></tr>';
        }
    },

    getTypeInfo(type, isPositive) {
        const typeMap = {
            'deposit': { class: 'deposit', icon: 'ri-arrow-down-line', label: 'Deposit' },
            'withdrawal': { class: 'withdrawal', icon: 'ri-arrow-right-up-line', label: 'Withdrawal' },
            'payment': { class: 'withdrawal', icon: 'ri-arrow-up-line', label: 'Payment' },
            'interest': { class: 'withdrawal', icon: 'ri-percent-line', label: 'Interest' },
            'disbursement': { class: 'deposit', icon: 'ri-arrow-down-line', label: 'Disbursement' }
        };

        if (typeMap[type]) return typeMap[type];

        return isPositive
            ? { class: 'deposit', icon: 'ri-arrow-down-line', label: this.capitalize(type) }
            : { class: 'withdrawal', icon: 'ri-arrow-up-line', label: this.capitalize(type) };
    },

    attachEvents() {
        const typeFilter = document.getElementById('typeFilter');
        const applyBtn = document.getElementById('applyFilterBtn');

        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                this.currentType = typeFilter ? typeFilter.value : 'all';
                this.loadData();
            });
        }

        if (typeFilter) {
            typeFilter.addEventListener('change', () => {
                this.currentType = typeFilter.value;
                this.loadData();
            });
        }
    },

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(Math.abs(amount));
    },

    formatDateTime(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }) + ' ' + date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Transactions.init());
} else {
    Transactions.init();
}

window.Transactions = Transactions;