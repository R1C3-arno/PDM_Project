    // /frontend/client/js/components/dashboard/main.js

    const Dashboard = {
        async init() {
            console.log('Initializing Dashboard...');

            try {
                // Load all HTML components
                await this.loadComponents();

                // Initialize all modules
                await this.initModules();

                console.log('Dashboard initialized successfully');
            } catch (error) {
                console.error('Error initializing dashboard:', error);
            }
        },

        async loadComponents() {
            const components = [
                { path: '/frontend/client/components/dashboard/title/index.html', target: 'dashboard-header' },
                { path: '/frontend/client/components/dashboard/stats-cards/index.html', target: 'dashboard-stats' },
                { path: '/frontend/client/components/dashboard/charts/index.html', target: 'dashboard-charts' },
                { path: '/frontend/client/components/dashboard/transactions-table/index.html', target: 'dashboard-transactions' },
                { path: '/frontend/client/components/dashboard/cta-section/index.html', target: 'dashboard-cta' },
                { path: '/frontend/client/components/dashboard/reminder-widget/index.html', target: 'dashboard-reminders' }
            ];

            await Promise.all(
                components.map(({ path, target }) =>
                    DashboardUtils.loadComponent(path, target)
                )
            );
        },

        async initModules() {
            // Initialize each module in sequence
            await DashboardHeader.init();
            await DashboardStats.init();
            await DashboardCharts.init();
            await DashboardTransactions.init();

            this.attachCTAEvents();
        },

        attachCTAEvents() {
            const ctaButtons = document.querySelectorAll('.btn-cta');
            ctaButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const action = e.target.dataset.action;
                    this.handleCTAAction(action);
                });
            });
        },

        handleCTAAction(action) {
            const routes = {
                'request-loan': '#/loans/request',
                'add-funds': '#/wallet/add-funds',
                'view-transactions': '#/transactions'
            };

            if (routes[action]) {
                window.location.hash = routes[action];
            }
        },

        async refresh() {
            console.log('Refreshing dashboard...');
            await this.initModules();
        }
    };

    // Auto-refresh every 5 minutes
    setInterval(() => Dashboard.refresh(), 5 * 60 * 1000);

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => Dashboard.init());
    } else {
        Dashboard.init();
    }

    window.Dashboard = Dashboard;