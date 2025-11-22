// /frontend/client/js/config/api-config.js

const API_BASE_URL = '/api';

const API_ENDPOINTS = {
    // User endpoints
    USER_INFO: `${API_BASE_URL}/user/profile`,
    USER_STATS: `${API_BASE_URL}/user/stats`,

    // Wallet endpoints
    WALLET_BALANCE: `${API_BASE_URL}/wallet/balance`,
    WALLET_TRANSACTIONS: `${API_BASE_URL}/wallet/transactions`,
    WALLET_ADD_FUNDS: `${API_BASE_URL}/wallet/add-funds`,

    // Loan.java endpoints
    LOANS_ACTIVE: `${API_BASE_URL}/loans/active`,
    LOANS_HISTORY: `${API_BASE_URL}/loans/history`,
    LOANS_REQUEST: `${API_BASE_URL}/loans/request`,
    LOANS_REPAY: `${API_BASE_URL}/loans/repay`,
    LOANS_STATS: `${API_BASE_URL}/loans/stats`,

    // Transaction endpoints
    TRANSACTIONS_RECENT: `${API_BASE_URL}/transactions/recent`,
    TRANSACTIONS_ALL: `${API_BASE_URL}/transactions/all`,

    // Chart data endpoints
    CHARTS_TRENDS: `${API_BASE_URL}/charts/trends`,
    CHARTS_DISTRIBUTION: `${API_BASE_URL}/charts/distribution`,
    CHARTS_MONTHLY: `${API_BASE_URL}/charts/monthly`,

    // Reminder endpoints
    REMINDERS_UPCOMING: `${API_BASE_URL}/reminders/upcoming`
};

// HTTP request helper
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// Export
window.API_CONFIG = {
    BASE_URL: API_BASE_URL,
    ENDPOINTS: API_ENDPOINTS,
    request: apiRequest
};