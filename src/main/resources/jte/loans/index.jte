@param String title
@param com.loanweb.app.domain.user.User user
@param java.util.List<com.loanweb.app.domain.loan.Loan> loans

@template.components.dashboard-layout(title = title, user = user, activePage = "loans", content = @`
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">My Loans</h1>
            <button class="btn-primary">
                <i class='bx bx-plus'></i> Apply for Loan
            </button>
        </div>

        <div class="card">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">ID</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Type</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Amount</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Interest</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Outstanding</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Created</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                        @if(loans.isEmpty())
                        <tr>
                            <td colspan="7" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                No loans found. Apply for your first loan!
                            </td>
                        </tr>
                        @else
                            @for(var loan : loans)
                            <tr class="table-row">
                                <td class="px-6 py-4 text-gray-900 dark:text-white">#${loan.id()}</td>
                                <td class="px-6 py-4 text-gray-900 dark:text-white">${loan.loanType()}</td>
                                <td class="px-6 py-4 text-gray-900 dark:text-white">$${String.format("%.2f", loan.loanAmount())}</td>
                                <td class="px-6 py-4 text-gray-900 dark:text-white">${loan.interestRate()}%</td>
                                <td class="px-6 py-4 text-gray-900 dark:text-white">$${String.format("%.2f", loan.outstandingBalance())}</td>
                                <td class="px-6 py-4">
                                    <span class="px-3 py-1 text-xs font-medium rounded-full
                                        ${loan.status() == com.loanweb.app.domain.loan.Loan.LoanStatus.ACTIVE ? "bg-green-100 text-green-800" :
                                          loan.status() == com.loanweb.app.domain.loan.Loan.LoanStatus.PENDING ? "bg-yellow-100 text-yellow-800" :
                                          loan.status() == com.loanweb.app.domain.loan.Loan.LoanStatus.PAID_OFF ? "bg-blue-100 text-blue-800" :
                                          "bg-gray-100 text-gray-800"}">
                                        ${loan.status()}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-gray-500 dark:text-gray-400">${loan.createdAt().toLocalDate()}</td>
                            </tr>
                            @endfor
                        @endif
                    </tbody>
                </table>
            </div>
        </div>
    </div>
`)
