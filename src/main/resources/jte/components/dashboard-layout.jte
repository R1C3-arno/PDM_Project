@param String title
@param com.loanweb.app.domain.user.User user
@param String activePage = "dashboard"
@param gg.jte.Content content

@template.components.layout(title = title, content = @`
    <div class="flex h-screen overflow-hidden">
        <!-- Sidebar -->
        <aside id="sidebar" class="fixed left-0 top-0 w-64 h-full bg-gray-900 text-white transition-transform duration-300 z-50">
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                <h2 class="text-xl font-bold">Loan System</h2>
                <button id="sidebar-close" class="lg:hidden">
                    <i class='bx bx-x text-2xl'></i>
                </button>
            </div>

            <nav class="p-4 space-y-1">
                <a href="/dashboard" class="sidebar-link ${activePage.equals("dashboard") ? "active" : ""}">
                    <i class='bx bx-grid-alt text-xl'></i>
                    <span>Dashboard</span>
                </a>
                <a href="/loans" class="sidebar-link ${activePage.equals("loans") ? "active" : ""}">
                    <i class='bx bx-money text-xl'></i>
                    <span>Loans</span>
                </a>
                <a href="/transactions" class="sidebar-link ${activePage.equals("transactions") ? "active" : ""}">
                    <i class='bx bx-transfer text-xl'></i>
                    <span>Transactions</span>
                </a>
                <a href="/wallet" class="sidebar-link ${activePage.equals("wallet") ? "active" : ""}">
                    <i class='bx bx-wallet text-xl'></i>
                    <span>My Wallet</span>
                </a>
                <a href="/tickets" class="sidebar-link ${activePage.equals("tickets") ? "active" : ""}">
                    <i class='bx bx-support text-xl'></i>
                    <span>Support</span>
                </a>
                @if(user.role() == com.loanweb.app.domain.user.User.UserRole.ADMIN)
                <a href="/users" class="sidebar-link ${activePage.equals("users") ? "active" : ""}">
                    <i class='bx bx-user text-xl'></i>
                    <span>Users</span>
                </a>
                @endif
            </nav>

            <div class="absolute bottom-0 w-full p-4 border-t border-gray-800">
                <form action="/logout" method="post">
                    <button type="submit" class="sidebar-link w-full">
                        <i class='bx bx-log-out text-xl'></i>
                        <span>Logout</span>
                    </button>
                </form>
            </div>
        </aside>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col lg:ml-64">
            <!-- Top Navigation -->
            <header class="bg-white dark:bg-gray-800 shadow-sm">
                <div class="flex items-center justify-between px-6 py-4">
                    <button id="sidebar-toggle" class="lg:hidden">
                        <i class='bx bx-menu text-2xl text-gray-700 dark:text-gray-200'></i>
                    </button>

                    <div class="flex items-center gap-4">
                        <div class="hidden md:block text-right">
                            <p class="text-sm font-medium text-gray-900 dark:text-white">${user.fullName()}</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">${user.email()}</p>
                        </div>
                        <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                            <span class="text-white font-semibold">${user.fullName().substring(0, 1)}</span>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Page Content -->
            <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
                <div class="container mx-auto px-6 py-8">
                    ${content}
                </div>
            </main>
        </div>
    </div>

    <script src="/js/script.js"></script>
`)
