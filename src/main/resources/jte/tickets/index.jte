@param String title
@param com.loanweb.app.domain.user.User user
@param java.util.List<com.loanweb.app.domain.ticket.SupportTicket> tickets

@template.components.dashboard-layout(title = title, user = user, activePage = "tickets", content = @`
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Support Tickets</h1>
            <button class="btn-primary">
                <i class='bx bx-plus'></i> New Ticket
            </button>
        </div>

        <div class="grid gap-4">
            @if(tickets.isEmpty())
            <div class="card text-center py-8">
                <p class="text-gray-500 dark:text-gray-400">No support tickets found</p>
                <p class="text-sm text-gray-400 dark:text-gray-500 mt-2">Create a new ticket to get help</p>
            </div>
            @else
                @for(var ticket : tickets)
                <div class="card hover:shadow-lg transition">
                    <div class="flex items-start justify-between mb-3">
                        <div class="flex-1">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">${ticket.subject()}</h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm">${ticket.description()}</p>
                        </div>
                        <span class="ml-4 px-3 py-1 text-xs font-medium rounded-full
                            ${ticket.status() == com.loanweb.app.domain.ticket.SupportTicket.TicketStatus.OPEN ? "bg-blue-100 text-blue-800" :
                              ticket.status() == com.loanweb.app.domain.ticket.SupportTicket.TicketStatus.IN_PROGRESS ? "bg-yellow-100 text-yellow-800" :
                              ticket.status() == com.loanweb.app.domain.ticket.SupportTicket.TicketStatus.RESOLVED ? "bg-green-100 text-green-800" :
                              "bg-gray-100 text-gray-800"}">
                            ${ticket.status()}
                        </span>
                    </div>
                    <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span><i class='bx bx-category'></i> ${ticket.category()}</span>
                        <span><i class='bx bx-flag'></i> ${ticket.priority()}</span>
                        <span><i class='bx bx-time'></i> ${ticket.createdAt().toLocalDate()}</span>
                    </div>
                </div>
                @endfor
            @endif
        </div>
    </div>
`)
