fetch('/frontend/server/components/supportticket_management/main.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('mainContent').innerHTML = html;
    });

fetch('/frontend/server/components/supportticket_management/view.html')  // Đường dẫn tương đối
    .then(response => response.text())
    .then(html => {
        document.getElementById('popupContainer').innerHTML = html;
    });

fetch('/frontend/server/components/supportticket_management/edit.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('editPopupContainer').innerHTML = html;
    });


// View Popup
function openTicketPopup(ticketId) {
    const tickets = {
        'T001': {
            id: '#T001',
            userId: 'U12345',
            subject: 'Cannot login to account',
            category: 'Technical',
            priority: 'High',
            status: 'In Progress',
            assigned: 'Admin #2',
            created: 'Jan 15, 2025'
        },
        'T002': {
            id: '#T002',
            userId: 'U12345',
            subject: 'Cannot login to account',
            category: 'Technical',
            priority: 'High',
            status: 'In Progress',
            assigned: 'Admin #2',
            created: 'Jan 15, 2025'
        }
    };

    const ticket = tickets[ticketId];
    document.getElementById('ticketPopupId').textContent = ticket.id;
    document.getElementById('ticketPopupSubject').textContent = ticket.subject;
    document.getElementById('ticketPopupUserId').textContent = ticket.userId;
    document.getElementById('ticketPopupCategory').textContent = ticket.category;
    document.getElementById('ticketPopupPriority').textContent = ticket.priority;
    document.getElementById('ticketPopupStatus').textContent = ticket.status;
    document.getElementById('ticketPopupAssigned').textContent = ticket.assigned;
    document.getElementById('ticketPopupCreated').textContent = ticket.created;

    document.getElementById('ticketPopup').classList.remove('hidden');
}

function closeTicketPopup() {
    document.getElementById('ticketPopup').classList.add('hidden');
}

// Edit Popup
function openEditTicketPopup(ticketId) {
    const tickets = {
        'T001': {
            id: '#T001',
            userId: 'U12345',
            subject: 'Cannot login to account',
            category: 'Technical',
            priority: 'High',
            status: 'In Progress',
            assigned: 'Admin #2',
            created: 'Jan 15, 2025'
        },
        'T002': {
            id: '#T002',
            userId: 'U12345',
            subject: 'Cannot login to account',
            category: 'Technical',
            priority: 'High',
            status: 'In Progress',
            assigned: 'Admin #2',
            created: 'Jan 15, 2025'
        }
    };

    const ticket = tickets[ticketId];
    document.getElementById('editTicketId').value = ticket.id;
    document.getElementById('editTicketUserId').value = ticket.userId;
    document.getElementById('editTicketSubject').value = ticket.subject;
    document.getElementById('editTicketCategory').value = ticket.category;
    document.getElementById('editTicketPriority').value = ticket.priority;
    document.getElementById('editTicketStatus').value = ticket.status;
    document.getElementById('editTicketAssigned').value = ticket.assigned;
    document.getElementById('editTicketCreated').value = ticket.created;

    document.getElementById('editTicketPopup').classList.remove('hidden');
}

function closeEditTicketPopup() {
    document.getElementById('editTicketPopup').classList.add('hidden');
}

function saveTicketEdit() {
    alert('Ticket updated!');
    closeEditTicketPopup();
}