@param String title
@param com.loanweb.app.domain.user.User currentUser
@param java.util.List<com.loanweb.app.domain.user.User> users

@template.components.dashboard-layout(title = title, user = currentUser, activePage = "users", content = @`
    <div class="space-y-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>

        <div class="card">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">ID</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Name</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Email</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Phone</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Role</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Joined</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                        @for(var u : users)
                        <tr class="table-row">
                            <td class="px-6 py-4 text-gray-900 dark:text-white">#${u.id()}</td>
                            <td class="px-6 py-4 text-gray-900 dark:text-white font-medium">${u.fullName()}</td>
                            <td class="px-6 py-4 text-gray-600 dark:text-gray-400">${u.email()}</td>
                            <td class="px-6 py-4 text-gray-600 dark:text-gray-400">${u.phone() != null ? u.phone() : "-"}</td>
                            <td class="px-6 py-4">
                                <span class="px-3 py-1 text-xs font-medium rounded-full
                                    ${u.role() == com.loanweb.app.domain.user.User.UserRole.ADMIN ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}">
                                    ${u.role()}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <span class="px-3 py-1 text-xs font-medium rounded-full
                                    ${u.status() == com.loanweb.app.domain.user.User.UserStatus.ACTIVE ? "bg-green-100 text-green-800" :
                                      u.status() == com.loanweb.app.domain.user.User.UserStatus.INACTIVE ? "bg-gray-100 text-gray-800" :
                                      "bg-red-100 text-red-800"}">
                                    ${u.status()}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-gray-500 dark:text-gray-400">${u.createdAt().toLocalDate()}</td>
                        </tr>
                        @endfor
                    </tbody>
                </table>
            </div>
        </div>
    </div>
`)
