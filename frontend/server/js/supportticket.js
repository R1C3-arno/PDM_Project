fetch('/frontend/server/components/supportticket_management/main.html')
    .then(r => r.text())
    .then(html => {
        document.getElementById('mainContent').innerHTML = html;
        loadTickets();
    });

fetch('/frontend/server/components/supportticket_management/view.html')
    .then(r => r.text())
    .then(html => document.getElementById('popupContainer').innerHTML = html);

fetch('/frontend/server/components/supportticket_management/edit.html')
    .then(r => r.text())
    .then(html => document.getElementById('editPopupContainer').innerHTML = html);

fetch('/frontend/server/components/supportticket_management/new.html')
    .then(r => r.text())
    .then(html => document.getElementById('newContainer').innerHTML = html);


function loadTickets() {
    fetch('/api/support-tickets')
        .then(r => r.json())
        .then(tickets => {
            const tbody = document.querySelector('tbody');
            tbody.innerHTML = tickets.map(ticket => {
                const priorityColors = {
                    'Low': 'bg-gray-100 text-gray-600',
                    'Medium': 'bg-orange-100 text-orange-600',
                    'High': 'bg-red-100 text-red-600',
                    'Urgent': 'bg-purple-100 text-purple-600'
                };
                const statusColors = {
                    'Open': 'bg-blue-100 text-blue-600',
                    'In Progress': 'bg-yellow-100 text-yellow-600',
                    'Resolved': 'bg-green-100 text-green-600',
                    'Closed': 'bg-gray-100 text-gray-600'
                };

                return `
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 text-sm font-semibold">#${ticket.id}</td>
                        <td class="px-6 py-4 text-sm">${ticket.userId}</td>
                        <td class="px-6 py-4 text-sm">${ticket.subject}</td>
                        <td class="px-6 py-4 text-sm">${ticket.category}</td>
                        <td class="px-6 py-4">
                            <span class="px-3 py-1 text-xs rounded-full ${priorityColors[ticket.priority] || 'bg-gray-100 text-gray-600'}">${ticket.priority}</span>
                        </td>
                        <td class="px-6 py-4">
                            <span class="px-3 py-1 text-xs rounded-full ${statusColors[ticket.status] || 'bg-gray-100 text-gray-600'}">${ticket.status}</span>
                        </td>
                        <td class="px-6 py-4 text-sm">${ticket.assignedTo || 'Unassigned'}</td>
                        <td class="px-6 py-4 text-sm">${ticket.createdAt || 'N/A'}</td>
                        <td class="px-6 py-4">
                            <div class="flex gap-2">
                                <button onclick="openTicketPopup(${ticket.id})" class="text-blue-600 hover:text-blue-800">👁️</button>
                                <button onclick="openEditTicketPopup(${ticket.id})" class="text-yellow-600 hover:text-yellow-800">✏️</button>
                                <button onclick="deleteTicket(${ticket.id})" class="text-red-600 hover:text-red-800">🗑️</button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
        });
}


window.openTicketPopup = function(id) {
    fetch(`/api/support-tickets/${id}`)
        .then(r => r.json())
        .then(ticket => {
            const priorityColors = {
                'Low': 'bg-gray-100 text-gray-600',
                'Medium': 'bg-orange-100 text-orange-600',
                'High': 'bg-red-100 text-red-600',
                'Urgent': 'bg-purple-100 text-purple-600'
            };
            const statusColors = {
                'Open': 'bg-blue-100 text-blue-600',
                'In Progress': 'bg-yellow-100 text-yellow-600',
                'Resolved': 'bg-green-100 text-green-600',
                'Closed': 'bg-gray-100 text-gray-600'
            };

            document.getElementById('ticketPopupId').textContent = `#${ticket.id}`;
            document.getElementById('ticketPopupSubject').textContent = ticket.subject;
            document.getElementById('ticketPopupUserId').textContent = ticket.userId;
            document.getElementById('ticketPopupCategory').textContent = ticket.category;
            document.getElementById('ticketPopupAssigned').textContent = ticket.assignedTo || 'Unassigned';
            document.getElementById('ticketPopupCreated').textContent = ticket.createdAt || 'N/A';
            document.getElementById('ticketPopupDescription').textContent = ticket.description || 'N/A';

            const priorityEl = document.getElementById('ticketPopupPriority');
            priorityEl.textContent = ticket.priority;
            priorityEl.className = `px-3 py-1 text-xs rounded-full ${priorityColors[ticket.priority] || 'bg-gray-100 text-gray-600'}`;

            const statusEl = document.getElementById('ticketPopupStatus');
            statusEl.textContent = ticket.status;
            statusEl.className = `px-3 py-1 text-xs rounded-full ${statusColors[ticket.status] || 'bg-gray-100 text-gray-600'}`;

            document.getElementById('ticketPopup').classList.remove('hidden');
        });
}

window.closeTicketPopup = function() {
    document.getElementById('ticketPopup').classList.add('hidden');
}


window.openEditTicketPopup = function(id) {
    fetch(`/api/support-tickets/${id}`)
        .then(r => r.json())
        .then(ticket => {
            document.getElementById('editTicketId').value = `#${ticket.id}`;
            document.getElementById('editTicketUserId').value = ticket.userId;
            document.getElementById('editTicketSubject').value = ticket.subject;
            document.getElementById('editTicketDescription').value = ticket.description || '';
            document.getElementById('editTicketCategory').value = ticket.category;
            document.getElementById('editTicketPriority').value = ticket.priority;
            document.getElementById('editTicketStatus').value = ticket.status;
            document.getElementById('editTicketAssigned').value = ticket.assignedTo || '';
            document.getElementById('editTicketPopup').dataset.id = id;
            document.getElementById('editTicketPopup').classList.remove('hidden');
        });
}

window.closeEditTicketPopup = function() {
    document.getElementById('editTicketPopup').classList.add('hidden');
}

window.saveTicketEdit = function() {
    const id = document.getElementById('editTicketPopup').dataset.id;
    const data = {
        userId: document.getElementById('editTicketUserId').value,
        subject: document.getElementById('editTicketSubject').value,
        description: document.getElementById('editTicketDescription').value,
        category: document.getElementById('editTicketCategory').value,
        priority: document.getElementById('editTicketPriority').value,
        status: document.getElementById('editTicketStatus').value,
        assignedTo: document.getElementById('editTicketAssigned').value || null
    };

    fetch(`/api/support-tickets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(() => {
        closeEditTicketPopup();
        loadTickets();
        alert('Ticket updated successfully!');
    });
}


window.openNewTicketPopup = function() {
    document.getElementById('newTicketForm').reset();
    document.getElementById('newTicketPriority').value = 'Medium';
    document.getElementById('newTicketPopup').classList.remove('hidden');
}

window.closeNewTicketPopup = function() {
    document.getElementById('newTicketPopup').classList.add('hidden');
}

window.createNewTicket = function() {
    const data = {
        userId: document.getElementById('newTicketUserId').value,
        subject: document.getElementById('newTicketSubject').value,
        description: document.getElementById('newTicketDescription').value,
        category: document.getElementById('newTicketCategory').value,
        priority: document.getElementById('newTicketPriority').value,
        status: 'Open',
        assignedTo: document.getElementById('newTicketAssigned').value || null
    };

    fetch('/api/support-tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(() => {
        closeNewTicketPopup();
        loadTickets();
        alert('Ticket created successfully!');
    });
}


window.deleteTicket = function(id) {
    if (confirm('Delete this ticket?')) {
        fetch(`/api/support-tickets/${id}`, { method: 'DELETE' })
            .then(() => {
                loadTickets();
                alert('Ticket deleted successfully!');
            });
    }
}
