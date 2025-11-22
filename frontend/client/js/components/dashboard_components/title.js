// /frontend/client/js/components/dashboard/header.js

const DashboardHeader = {
    async init() {
        await this.loadData();
        this.attachEvents();
    },

    async loadData() {
        try {
            const [userInfo, walletStats] = await Promise.all([
                DashboardAPI.getUserInfo(),
                DashboardAPI.getWalletStats()
            ]);

            this.renderUserInfo(userInfo);
            this.renderStats(walletStats);
        } catch (error) {
            console.error('Error loading header data:', error);
        }
    },

    renderUserInfo(data) {
        const userName = document.getElementById('userName');
        const userRole = document.getElementById('userRole');
        const userAvatar = document.getElementById('userAvatar');

        if (userName) userName.textContent = data.name;
        if (userRole) userRole.textContent = data.role || 'Member';
        if (userAvatar && data.avatar) userAvatar.src = data.avatar;
    },

    renderStats(data) {
        const balance = document.getElementById('walletBalance');
        const outstanding = document.getElementById('outstandingLoan');
        const paid = document.getElementById('paidLoans');

        if (balance) balance.textContent = DashboardUtils.formatCurrency(data.balance);
        if (outstanding) outstanding.textContent = DashboardUtils.formatCurrency(data.outstanding);
        if (paid) paid.textContent = DashboardUtils.formatCurrency(data.paidLoans);
    },

    attachEvents() {
        const addFundsBtn = document.getElementById('addFundsBtn');
        const requestLoanBtn = document.getElementById('requestLoanBtn');
        const repayLoanBtn = document.getElementById('repayLoanBtn');

        if (addFundsBtn) {
            addFundsBtn.addEventListener('click', () => this.handleAddFunds());
        }
        if (requestLoanBtn) {
            requestLoanBtn.addEventListener('click', () => this.handleRequestLoan());
        }
        if (repayLoanBtn) {
            repayLoanBtn.addEventListener('click', () => this.handleRepayLoan());
        }
    },

    handleAddFunds() {
        console.log('Add funds clicked');
        // Navigate to add funds page
        window.location.hash = '#/wallet/add-funds';
    },

    handleRequestLoan() {
        console.log('Request loan clicked');
        // Navigate to loan request page
        window.location.hash = '#/loans/request';
    },

    handleRepayLoan() {
        console.log('Repay loan clicked');
        // Navigate to repay page
        window.location.hash = '#/loans/repay';
    }
};

window.DashboardHeader = DashboardHeader;