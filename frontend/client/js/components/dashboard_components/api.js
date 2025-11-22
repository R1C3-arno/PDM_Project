// /frontend/client/js/components/dashboard/api.js

const DashboardAPI = {
    // Fetch user information
    async getUserInfo() {
        return await API_CONFIG.request(API_CONFIG.ENDPOINTS.USER_INFO);
    },

    // Fetch wallet balance and stats
    async getWalletStats() {
        return await API_CONFIG.request(API_CONFIG.ENDPOINTS.USER_STATS);
    },

    // Fetch active loans
    async getActiveLoans() {
        return await API_CONFIG.request(API_CONFIG.ENDPOINTS.LOANS_ACTIVE);
    },

    // Fetch recent activity
    async getRecentTransactions(limit = 5) {
        return await API_CONFIG.request(
            `${API_CONFIG.ENDPOINTS.TRANSACTIONS_RECENT}?limit=${limit}`
        );
    },

    // Fetch chart data
    async getChartTrends(months = 6) {
        return await API_CONFIG.request(
            `${API_CONFIG.ENDPOINTS.CHARTS_TRENDS}?months=${months}`
        );
    },

    async getChartDistribution() {
        return await API_CONFIG.request(API_CONFIG.ENDPOINTS.CHARTS_DISTRIBUTION);
    },

    async getChartMonthly() {
        return await API_CONFIG.request(API_CONFIG.ENDPOINTS.CHARTS_MONTHLY);
    },

    // Fetch upcoming payment reminders
    async getUpcomingReminders() {
        return await API_CONFIG.request(API_CONFIG.ENDPOINTS.REMINDERS_UPCOMING);
    },

    // Action endpoints
    async addFunds(amount) {
        return await API_CONFIG.request(API_CONFIG.ENDPOINTS.WALLET_ADD_FUNDS, {
            method: 'POST',
            body: JSON.stringify({ amount })
        });
    },

    async requestLoan(loanData) {
        return await API_CONFIG.request(API_CONFIG.ENDPOINTS.LOANS_REQUEST, {
            method: 'POST',
            body: JSON.stringify(loanData)
        });
    },

    async repayLoan(loanId, amount) {
        return await API_CONFIG.request(API_CONFIG.ENDPOINTS.LOANS_REPAY, {
            method: 'POST',
            body: JSON.stringify({ loanId, amount })
        });
    }
};

window.DashboardAPI = DashboardAPI;