@param String title
@param com.loanweb.app.domain.user.User user
@param com.loanweb.app.domain.wallet.Wallet wallet
@param java.util.List<com.loanweb.app.domain.transaction.Transaction> transactions

@template.components.dashboard-layout(title = title, user = user, activePage = "wallet", content = @`
    <div class="space-y-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">My Wallet</h1>

        <!-- Wallet Stats -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <p class="text-blue-100 text-sm mb-2">Current Balance</p>
                <p class="text-3xl font-bold">$${wallet != null ? String.format("%.2f", wallet.balance()) : "0.00"}</p>
            </div>

            <div class="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                <p class="text-green-100 text-sm mb-2">Available Credit</p>
                <p class="text-3xl font-bold">$${wallet != null ? String.format("%.2f", wallet.availableCredit()) : "0.00"}</p>
            </div>

            <div class="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <p class="text-purple-100 text-sm mb-2">Total Borrowed</p>
                <p class="text-3xl font-bold">$${wallet != null ? String.format("%.2f", wallet.totalBorrowed()) : "0.00"}</p>
            </div>

            <div class="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <p class="text-orange-100 text-sm mb-2">Total Repaid</p>
                <p class="text-3xl font-bold">$${wallet != null ? String.format("%.2f", wallet.totalRepaid()) : "0.00"}</p>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="card">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button class="btn-primary">
                    <i class='bx bx-plus-circle'></i> Add Money
                </button>
                <button class="btn-secondary">
                    <i class='bx bx-transfer'></i> Transfer
                </button>
                <button class="btn-secondary">
                    <i class='bx bx-download'></i> Withdraw
                </button>
            </div>
        </div>

        <!-- Recent Transactions -->
        <div class="card">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Wallet Transactions</h2>
            <div class="space-y-3">
                @if(transactions.isEmpty())
                    <p class="text-gray-500 dark:text-gray-400 text-center py-4">No transactions yet</p>
                @else
                    @for(var txn : transactions)
                    <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-full ${txn.amount().compareTo(java.math.BigDecimal.ZERO) >= 0 ? "bg-green-100" : "bg-red-100"} flex items-center justify-center">
                                <i class='bx ${txn.amount().compareTo(java.math.BigDecimal.ZERO) >= 0 ? "bx-up-arrow-alt text-green-600" : "bx-down-arrow-alt text-red-600"} text-2xl'></i>
                            </div>
                            <div>
                                <p class="font-medium text-gray-900 dark:text-white">${txn.transactionType()}</p>
                                <p class="text-sm text-gray-500 dark:text-gray-400">${txn.transactionDate().toLocalDate()}</p>
                            </div>
                        </div>
                        <p class="text-xl font-bold ${txn.amount().compareTo(java.math.BigDecimal.ZERO) >= 0 ? "text-green-600" : "text-red-600"}">
                            ${txn.amount().compareTo(java.math.BigDecimal.ZERO) >= 0 ? "+" : ""}$${String.format("%.2f", txn.amount())}
                        </p>
                    </div>
                    @endfor
                @endif
            </div>
        </div>
    </div>
`)
