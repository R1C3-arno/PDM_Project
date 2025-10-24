@param String title
@param com.loanweb.app.domain.user.User user
@param java.util.List<com.loanweb.app.domain.transaction.Transaction> transactions

@template.components.dashboard-layout(title = title, user = user, activePage = "transactions", content = @`
    <div class="space-y-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Transaction History</h1>

        <div class="card">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Reference</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Type</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Amount</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Description</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                        @if(transactions.isEmpty())
                        <tr>
                            <td colspan="6" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                No transactions found
                            </td>
                        </tr>
                        @else
                            @for(var txn : transactions)
                            <tr class="table-row">
                                <td class="px-6 py-4 text-gray-900 dark:text-white font-mono text-sm">${txn.referenceNumber()}</td>
                                <td class="px-6 py-4 text-gray-900 dark:text-white">${txn.transactionType()}</td>
                                <td class="px-6 py-4 font-semibold ${txn.amount().compareTo(java.math.BigDecimal.ZERO) >= 0 ? "text-green-600" : "text-red-600"}">
                                    ${txn.amount().compareTo(java.math.BigDecimal.ZERO) >= 0 ? "+" : ""}$${String.format("%.2f", txn.amount())}
                                </td>
                                <td class="px-6 py-4 text-gray-600 dark:text-gray-400">${txn.description()}</td>
                                <td class="px-6 py-4">
                                    <span class="px-3 py-1 text-xs font-medium rounded-full
                                        ${txn.status() == com.loanweb.app.domain.transaction.Transaction.TransactionStatus.COMPLETED ? "bg-green-100 text-green-800" :
                                          txn.status() == com.loanweb.app.domain.transaction.Transaction.TransactionStatus.PENDING ? "bg-yellow-100 text-yellow-800" :
                                          txn.status() == com.loanweb.app.domain.transaction.Transaction.TransactionStatus.FAILED ? "bg-red-100 text-red-800" :
                                          "bg-gray-100 text-gray-800"}">
                                        ${txn.status()}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-gray-500 dark:text-gray-400">${txn.transactionDate()}</td>
                            </tr>
                            @endfor
                        @endif
                    </tbody>
                </table>
            </div>
        </div>
    </div>
`)
