@param String title
@param com.loanweb.app.domain.user.User user
@param com.loanweb.app.domain.wallet.Wallet wallet
@param java.util.List<com.loanweb.app.domain.loan.Loan> loans
@param Long activeLoansCount
@param java.math.BigDecimal totalOutstanding
@param java.util.List<com.loanweb.app.domain.transaction.Transaction> recentTransactions
@param Long unreadNotifications

@template.components.dashboard-layout(title = title, user = user, activePage = "dashboard", content = @`
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-blue-100 text-sm">Wallet Balance</p>
                        <p class="text-3xl font-bold mt-2">$${wallet != null ? String.format("%.2f", wallet.balance()) : "0.00"}</p>
                    </div>
                    <i class='bx bx-wallet text-5xl opacity-50'></i>
                </div>
            </div>

            <div class="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-green-100 text-sm">Available Credit</p>
                        <p class="text-3xl font-bold mt-2">$${wallet != null ? String.format("%.2f", wallet.availableCredit()) : "0.00"}</p>
                    </div>
                    <i class='bx bx-credit-card text-5xl opacity-50'></i>
                </div>
            </div>

            <div class="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-purple-100 text-sm">Active Loans</p>
                        <p class="text-3xl font-bold mt-2">${activeLoansCount}</p>
                    </div>
                    <i class='bx bx-money text-5xl opacity-50'></i>
                </div>
            </div>

            <div class="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-orange-100 text-sm">Total Outstanding</p>
                        <p class="text-3xl font-bold mt-2">$${String.format("%.2f", totalOutstanding)}</p>
                    </div>
                    <i class='bx bx-trending-up text-5xl opacity-50'></i>
                </div>
            </div>
        </div>

        <!-- Recent Activity -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Recent Loans -->
            <div class="card">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Recent Loans</h2>
                    <a href="/loans" class="text-blue-600 hover:text-blue-700 text-sm">View All</a>
                </div>
                <div class="space-y-3">
                    @if(loans.isEmpty())
                        <p class="text-gray-500 dark:text-gray-400 text-center py-4">No loans yet</p>
                    @else
                        @for(var loan : loans.stream().limit(3).toList())
                        <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div>
                                <p class="font-medium text-gray-900 dark:text-white">${loan.loanType()}</p>
                                <p class="text-sm text-gray-500 dark:text-gray-400">$${String.format("%.2f", loan.loanAmount())}</p>
                            </div>
                            <span class="px-3 py-1 text-xs font-medium rounded-full
                                ${loan.status() == com.loanweb.app.domain.loan.Loan.LoanStatus.ACTIVE ? "bg-green-100 text-green-800" :
                                  loan.status() == com.loanweb.app.domain.loan.Loan.LoanStatus.PENDING ? "bg-yellow-100 text-yellow-800" :
                                  "bg-gray-100 text-gray-800"}">
                                ${loan.status()}
                            </span>
                        </div>
                        @endfor
                    @endif
                </div>
            </div>

            <!-- Recent Transactions -->
            <div class="card">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Recent Transactions</h2>
                    <a href="/transactions" class="text-blue-600 hover:text-blue-700 text-sm">View All</a>
                </div>
                <div class="space-y-3">
                    @if(recentTransactions.isEmpty())
                        <p class="text-gray-500 dark:text-gray-400 text-center py-4">No transactions yet</p>
                    @else
                        @for(var txn : recentTransactions)
                        <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div>
                                <p class="font-medium text-gray-900 dark:text-white">${txn.transactionType()}</p>
                                <p class="text-sm text-gray-500 dark:text-gray-400">${txn.transactionDate().toLocalDate()}</p>
                            </div>
                            <p class="font-semibold ${txn.amount().compareTo(java.math.BigDecimal.ZERO) >= 0 ? "text-green-600" : "text-red-600"}">
                                ${txn.amount().compareTo(java.math.BigDecimal.ZERO) >= 0 ? "+" : ""}$${String.format("%.2f", txn.amount())}
                            </p>
                        </div>
                        @endfor
                    @endif
                </div>
            </div>
        </div>
    </div>
`)
