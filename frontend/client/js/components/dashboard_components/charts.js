
const DashboardCharts = {
    charts: {},

    async init() {
        await this.loadData();
        this.attachEvents();
    },

    async loadData(months = 6) {
        try {
            const [trends, distribution, monthly] = await Promise.all([
                DashboardAPI.getChartTrends(months),
                DashboardAPI.getChartDistribution(),
                DashboardAPI.getChartMonthly()
            ]);

            this.renderLineChart(trends);
            this.renderPieChart(distribution);
            this.renderBarChart(monthly);
        } catch (error) {
            console.error('Error loading charts:', error);
        }
    },

    renderLineChart(data) {
        const ctx = document.getElementById('lineChart');
        if (!ctx) return;

        if (this.charts.line) this.charts.line.destroy();

        this.charts.line = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Loans',
                        data: data.loans,
                        borderColor: '#FF9800',
                        backgroundColor: 'rgba(255, 152, 0, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Payments',
                        data: data.payments,
                        borderColor: '#4CAF50',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { position: 'bottom' } },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: value => '$' + value.toLocaleString()
                        }
                    }
                }
            }
        });
    },

    renderPieChart(data) {
        const ctx = document.getElementById('pieChart');
        if (!ctx) return;

        if (this.charts.pie) this.charts.pie.destroy();

        this.charts.pie = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    backgroundColor: ['#4CAF50', '#2196F3', '#FF9800'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { position: 'bottom' } }
            }
        });
    },

    renderBarChart(data) {
        const ctx = document.getElementById('barChart');
        if (!ctx) return;

        if (this.charts.bar) this.charts.bar.destroy();

        this.charts.bar = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [
                    { label: 'Income', data: data.income, backgroundColor: '#4CAF50' },
                    { label: 'Expenses', data: data.expenses, backgroundColor: '#f44336' }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { position: 'bottom' } },
                scales: { y: { beginAtZero: true } }
            }
        });
    },

    attachEvents() {
        const filter = document.getElementById('lineChartFilter');
        if (filter) {
            filter.addEventListener('change', (e) => {
                const months = e.target.value === 'all' ? 0 : parseInt(e.target.value);
                this.loadData(months);
            });
        }
    }
};

window.DashboardCharts = DashboardCharts;