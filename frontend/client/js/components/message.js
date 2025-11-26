const Messages = {
    userId: null,
    currentTicketId: null,
    tickets: [],

    async init() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) {
            alert('Please login first!');
            window.location.href = '/frontend/client/pages/Authentication/index.html';
            return;
        }

        this.userId = user.id;
        await this.loadTickets();
        this.attachEvents();
    },

    async loadTickets() {
        try {
            const response = await fetch(`http://localhost:8080/api/support-tickets/user/${this.userId}`);
            this.tickets = await response.json();
            this.renderTicketsList();

            if (this.tickets.length > 0 && !this.currentTicketId) {
                this.selectTicket(this.tickets[0].id);
            }
        } catch (error) {
            console.error('Error loading tickets:', error);
            this.renderEmptyTickets();
        }
    },

    renderTicketsList() {
        const container = document.getElementById('ticketsList');
        if (!container) return;

        if (!this.tickets || this.tickets.length === 0) {
            this.renderEmptyTickets();
            return;
        }

        container.innerHTML = this.tickets.map(ticket => {
            const isActive = this.currentTicketId === ticket.id;
            const timeAgo = this.getRelativeTime(ticket.updatedAt);

            return `
            <div class="message-item ${isActive ? 'active' : ''}" data-ticket-id="${ticket.id}">
                <div class="message-avatar">
                    <i class="ri-admin-fill"></i>
                </div>
                <div class="message-preview">
                    <div class="message-header">
                        <h4>${ticket.subject || 'Support Ticket #' + ticket.id}</h4>
                        <span class="message-time">${timeAgo}</span>
                    </div>
                    <p class="message-text">${ticket.status === 'open' ? 'Active' : 'Closed'}</p>
                </div>
            </div>
            `;
        }).join('');

        const items = container.querySelectorAll('.message-item');
        items.forEach(item => {
            item.addEventListener('click', () => {
                const ticketId = parseInt(item.dataset.ticketId);
                this.selectTicket(ticketId);
            });
        });
    },

    renderEmptyTickets() {
        const container = document.getElementById('ticketsList');
        if (container) {
            container.innerHTML = '<div style="padding: 2rem; text-align: center; color: #999;">No conversations yet</div>';
        }
    },

    async selectTicket(ticketId) {
        this.currentTicketId = ticketId;
        const ticket = this.tickets.find(t => t.id === ticketId);

        document.getElementById('chatTitle').textContent = ticket ? (ticket.subject || 'Support Ticket #' + ticketId) : 'Admin Support';
        document.getElementById('chatStatus').textContent = ticket ? ticket.status : '-';

        this.renderTicketsList();
        await this.loadMessages(ticketId);
    },

    async loadMessages(ticketId) {
        try {
            const response = await fetch(`http://localhost:8080/api/ticket-messages/ticket/${ticketId}`);
            const messages = await response.json();
            this.renderMessages(messages);
        } catch (error) {
            console.error('Error loading messages:', error);
            this.renderEmptyMessages();
        }
    },

    renderMessages(messages) {
        const container = document.getElementById('chatMessages');
        if (!container) return;

        if (!messages || messages.length === 0) {
            this.renderEmptyMessages();
            return;
        }

        container.innerHTML = messages.map(msg => {
            const isSent = msg.senderType === 'user';
            const messageClass = isSent ? 'sent' : 'received';
            const time = this.formatTime(msg.createdAt);

            return `
            <div class="chat-message ${messageClass}">
                <div class="message-content">
                    <p>${msg.message || ''}</p>
                    <span class="message-timestamp">${time}</span>
                </div>
            </div>
            `;
        }).join('');

        container.scrollTop = container.scrollHeight;
    },

    renderEmptyMessages() {
        const container = document.getElementById('chatMessages');
        if (container) {
            container.innerHTML = '<div style="text-align: center; padding: 3rem; color: #999;">No messages yet</div>';
        }
    },

    attachEvents() {
        const sendBtn = document.getElementById('sendBtn');
        const messageInput = document.getElementById('messageInput');

        if (sendBtn && messageInput) {
            sendBtn.addEventListener('click', () => this.sendMessage());

            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }
    },

    async sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();

        if (!message) {
            alert('Please enter a message');
            return;
        }

        if (!this.currentTicketId) {
            alert('Please select a conversation first');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/ticket-messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ticketId: this.currentTicketId,
                    senderType: 'user',
                    message: message
                })
            });

            if (response.ok) {
                messageInput.value = '';
                await this.loadMessages(this.currentTicketId);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message');
        }
    },

    getRelativeTime(dateString) {
        if (!dateString) return 'Just now';

        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now - date;
        const diffMin = Math.floor(diffMs / (1000 * 60));
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);

        if (diffMin < 60) return `${diffMin}m ago`;
        if (diffHour < 24) return `${diffHour}h ago`;
        if (diffDay === 1) return 'Yesterday';
        if (diffDay < 7) return `${diffDay}d ago`;

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    },

    formatTime(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Messages.init());
} else {
    Messages.init();
}

window.Messages = Messages;