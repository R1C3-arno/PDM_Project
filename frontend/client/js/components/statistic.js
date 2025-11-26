const Statistics = {
    async init() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) {
            alert('Please login first!');
            window.location.href = '/frontend/client/pages/Authentication/index.html';
            return;
        }

        await this.loadData(user.id);
    },

    async loadData(userId) {
        try {
            const stats = await this.getStatistics(userId);
            this.renderOverview(stats.overview);
            this.renderProgress(stats.loanProgress);
            this.renderBreakdown(stats.breakdown);
            this.renderSchedule(stats.upcomingPayments);
        } catch (error) {
            console.error('Error loading statistics:', error);
        }
    },

    async getStatistics(userId) {
        const response = await fetch(`http://localhost:8080/api/statistics/user/${userId}`);
        return await response.json();
    },

    renderOverview(overview) {
        document.getElementById('totalBorrowed').textContent = this.formatCurrency(overview.totalBorrowed);
        document.getElementById('outstandingDebt').textContent = this.formatCurrency(overview.outstandingDebt);
        document.getElementById('totalInterestPaid').textContent = this.formatCurrency(overview.totalInterestPaid);

        if (overview.nextPayment) {
            document.getElementById('nextPaymentAmount').textContent = this.formatCurrency(overview.nextPayment.amount);
            document.getElementById('nextPaymentDate').textContent = overview.nextPayment.dueDate
                ? 'Due ' + this.formatDate(overview.nextPayment.dueDate)
                : 'No upcoming payment';
        }
    },

    renderProgress(loanProgress) {
        const container = document.getElementById('progressList');
        if (!container) return;

        if (!loanProgress || loanProgress.length === 0) {
            container.innerHTML = '<p style="text-align: center; padding: 2rem; color: #999;">No active loans</p>';
            return;
        }

        container.innerHTML = loanProgress.map(loan => `
            <div class="progress-item">
                <div class="progress-header">
                    <span>${this.formatLoanType(loan.loanType)} #${loan.loanId}</span>
                    <span class="progress-percent">${loan.progressPercent}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${loan.progressPercent}%"></div>
                </div>
                <div class="progress-detail">
                    <span>Paid: ${this.formatCurrency(loan.paidAmount)}</span>
                    <span>Remaining: ${this.formatCurrency(loan.remaining)}</span>
                </div>
            </div>
        `).join('');
    },

    renderBreakdown(breakdown) {
        document.getElementById('breakdownPrincipal').textContent = this.formatCurrency(breakdown.principalAmount);
        document.getElementById('breakdownInterest').textContent = this.formatCurrency(breakdown.interestAccrued);
        document.getElementById('breakdownPaid').textContent = this.formatCurrency(breakdown.paidAmount);
    },

    renderSchedule(payments) {
        const tbody = document.getElementById('paymentScheduleBody');
        if (!tbody) return;

        if (!payments || payments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 2rem; color: #999;">No upcoming payments</td></tr>';
            return;
        }

        const today = new Date();

        tbody.innerHTML = payments.map((payment, index) => {
            const dueDate = new Date(payment.dueDate);
            const daysUntil = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

            let statusClass = 'scheduled';
            let statusText = 'Scheduled';

            if (daysUntil <= 30) {
                statusClass = 'pending';
                statusText = 'Upcoming';
            }

            return `
                <tr>
                    <td>${this.formatLoanType(payment.loanType)} #${payment.loanId}</td>
                    <td>${this.formatDate(payment.dueDate)}</td>
                    <td class="amount-highlight">${this.formatCurrency(payment.amount)}</td>
                    <td><span class="status ${statusClass}">${statusText}</span></td>
                </tr>
            `;
        }).join('');
    },

    formatLoanType(type) {
        if (!type) return 'Loan';
        return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
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
    document.addEventListener('DOMContentLoaded', () => Statistics.init());
} else {
    Statistics.init();
}

window.Statistics = Statistics;