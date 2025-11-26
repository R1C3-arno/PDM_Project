const DashboardAPI = {
    async getUserInfo() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) throw new Error('User not logged in');
        return await fetch(`http://localhost:8080/api/users/${user.id}`).then(r => r.json());
    },

    async getWalletStats() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) throw new Error('User not logged in');
        return await fetch(`http://localhost:8080/api/users/${user.id}/stats`).then(r => r.json());
    },

    async getActiveLoans() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) throw new Error('User not logged in');
        return await fetch(`http://localhost:8080/api/loans/active?userId=${user.id}`).then(r => r.json());
    },

    async getRecentTransactions(limit = 5) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) throw new Error('User not logged in');
        return await fetch(`http://localhost:8080/api/transactions/recent?userId=${user.id}&limit=${limit}`).then(r => r.json());
    },

    async getChartTrends(months = 6) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) throw new Error('User not logged in');
        return await fetch(`http://localhost:8080/api/charts/trends?userId=${user.id}&months=${months}`).then(r => r.json());
    },

    async getChartDistribution() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) throw new Error('User not logged in');
        return await fetch(`http://localhost:8080/api/charts/distribution?userId=${user.id}`).then(r => r.json());
    },

    async getChartMonthly() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) throw new Error('User not logged in');
        return await fetch(`http://localhost:8080/api/charts/monthly?userId=${user.id}`).then(r => r.json());
    },

    async getUpcomingReminders() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) throw new Error('User not logged in');
        return await fetch(`http://localhost:8080/api/reminders/upcoming?userId=${user.id}`).then(r => r.json());
    },

    async addFunds(amount) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) throw new Error('User not logged in');
        return await fetch(`http://localhost:8080/api/wallet/add-funds`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, amount })
        }).then(r => r.json());
    },

    async requestLoan(loanData) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) throw new Error('User not logged in');
        loanData.userId = user.id;
        return await fetch(`http://localhost:8080/api/loans`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loanData)
        }).then(r => r.json());
    },

    async repayLoan(loanId, amount) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) throw new Error('User not logged in');
        return await fetch(`http://localhost:8080/api/loans/repay`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, loanId, amount })
        }).then(r => r.json());
    }
};

window.DashboardAPI = DashboardAPI;