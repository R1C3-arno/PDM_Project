const MyLoan = {
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

            const [loans, stats] = await Promise.all([
                this.getLoans(user.id),
                this.getLoanStats(user.id)
            ]);

            this.renderStats(stats);
            this.renderLoans(loans);
        } catch (error) {
            console.error('Error loading loan data:', error);
        }
    },

    async getLoans(userId) {
        const response = await fetch(`http://localhost:8080/api/loans/user/${userId}`);
        return await response.json();
    },

    async getLoanStats(userId) {
        const response = await fetch(`http://localhost:8080/api/loans/user/${userId}/stats`);
        return await response.json();
    },

    renderStats(stats) {
        document.getElementById('activeLoansCount').textContent = stats.activeLoans || 0;
        document.getElementById('pendingLoansCount').textContent = stats.pendingLoans || 0;
        document.getElementById('completedLoansCount').textContent = stats.completedLoans || 0;
    },

    renderLoans(loans) {
        const container = document.getElementById('loansList');
        if (!container) return;

        if (!loans || loans.length === 0) {
            container.innerHTML = '<p style="text-align: center; padding: 2rem; color: #999;">No loans yet</p>';
            return;
        }

        container.innerHTML = loans.map(loan => {
            const statusClass = this.getStatusClass(loan.status);
            const statusText = this.getStatusText(loan.status);
            const nextPaymentDate = this.calculateNextPaymentDate(loan.startDate);

            return `
            <div class="loan-item">
                <div class="loan-main">
                    <div class="loan-info">
                        <h3>${this.formatLoanType(loan.loanType)} #${loan.id}</h3>
                        <p>Applied on ${this.formatDate(loan.createdAt)}</p>
                    </div>
                    <div class="loan-amount">
                        <div class="amount-label">Loan Amount</div>
                        <div class="amount-value">${this.formatCurrency(loan.loanAmount)}</div>
                    </div>
                    <div class="loan-status">
                        <span class="status ${statusClass}">${statusText}</span>
                    </div>
                </div>
                <div class="loan-details">
                    <div class="detail-item">
                        <span class="detail-label">Interest Rate:</span>
                        <span class="detail-value">${loan.interestRate}% per year</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Monthly Payment:</span>
                        <span class="detail-value">${this.formatCurrency(loan.monthlyPayment)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Remaining:</span>
                        <span class="detail-value">${this.formatCurrency(loan.outstandingBalance)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">${loan.status === 'pending' ? 'Expected:' : 'Next Payment:'}</span>
                        <span class="detail-value">${loan.status === 'pending' ? 'Under Review' : this.formatDate(nextPaymentDate)}</span>
                    </div>
                </div>
            </div>
            `;
        }).join('');
    },

    getStatusClass(status) {
        const statusMap = {
            'active': 'approved',
            'approved': 'approved',
            'pending': 'pending',
            'completed': 'completed',
            'paid': 'completed',
            'rejected': 'rejected'
        };
        return statusMap[status] || 'pending';
    },

    getStatusText(status) {
        const textMap = {
            'active': 'Active',
            'approved': 'Approved',
            'pending': 'Pending',
            'completed': 'Completed',
            'paid': 'Paid',
            'rejected': 'Rejected'
        };
        return textMap[status] || status;
    },

    formatLoanType(type) {
        if (!type) return 'Loan';
        return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    },

    calculateNextPaymentDate(startDate) {
        if (!startDate) return 'N/A';
        const start = new Date(startDate);
        const now = new Date();
        let nextPayment = new Date(start);

        while (nextPayment < now) {
            nextPayment.setMonth(nextPayment.getMonth() + 1);
        }

        return nextPayment.toISOString().split('T')[0];
    },

    formatCurrency(amount) {
        if (!amount) return '$0.00';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => MyLoan.init());
} else {
    MyLoan.init();
}

window.MyLoan = MyLoan;