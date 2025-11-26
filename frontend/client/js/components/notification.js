const Notifications = {
    userId: null,
    currentFilter: 'all',
    allNotifications: [],

    async init() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) {
            alert('Please login first!');
            window.location.href = '/frontend/client/pages/Authentication/index.html';
            return;
        }

        this.userId = user.id;
        await this.loadData();
        this.attachEvents();
    },

    async loadData() {
        try {
            const notifications = await this.getNotifications();
            this.allNotifications = notifications;
            this.updateUnreadCount();
            this.renderNotifications();
        } catch (error) {
            console.error('Error loading notifications:', error);
            this.renderEmpty();
        }
    },

    async getNotifications() {
        const url = this.currentFilter === 'unread'
            ? `http://localhost:8080/api/notifications/user/${this.userId}?isRead=false`
            : `http://localhost:8080/api/notifications/user/${this.userId}`;

        const response = await fetch(url);
        return await response.json();
    },

    updateUnreadCount() {
        const unreadCount = this.allNotifications.filter(n => !n.isRead).length;
        const countEl = document.getElementById('unreadCount');
        if (countEl) {
            countEl.textContent = unreadCount;
        }
    },

    renderNotifications() {
        const container = document.getElementById('notificationsList');
        if (!container) return;

        const notifications = this.currentFilter === 'unread'
            ? this.allNotifications.filter(n => !n.isRead)
            : this.allNotifications;

        if (!notifications || notifications.length === 0) {
            this.renderEmpty();
            return;
        }

        container.innerHTML = notifications.map(notif => {
            const iconInfo = this.getIconInfo(notif.type);
            const timeAgo = this.getRelativeTime(notif.createdAt);
            const isUnread = !notif.isRead;

            return `
            <div class="notification-item ${isUnread ? 'unread' : ''}">
                <div class="notification-icon ${iconInfo.class}">
                    <i class="${iconInfo.icon}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-header">
                        <h4>${notif.title || 'Notification'}</h4>
                        <span class="notification-time">${timeAgo}</span>
                    </div>
                    <p>${notif.message || ''}</p>
                    ${isUnread ? `
                    <div class="notification-actions">
                        <button class="action-btn" onclick="Notifications.markAsRead(${notif.id})">Mark as Read</button>
                    </div>
                    ` : ''}
                </div>
            </div>
            `;
        }).join('');
    },

    renderEmpty() {
        const container = document.getElementById('notificationsList');
        if (container) {
            const message = this.currentFilter === 'unread'
                ? 'No unread notifications'
                : 'No notifications yet';
            container.innerHTML = `<p style="text-align: center; padding: 3rem; color: #999;">${message}</p>`;
        }
    },

    getIconInfo(type) {
        const iconMap = {
            'success': { class: 'success', icon: 'ri-checkbox-circle-fill' },
            'warning': { class: 'warning', icon: 'ri-alarm-warning-fill' },
            'info': { class: 'info', icon: 'ri-information-fill' },
            'payment': { class: 'success', icon: 'ri-money-dollar-circle-fill' },
            'approval': { class: 'success', icon: 'ri-check-double-fill' },
            'reminder': { class: 'warning', icon: 'ri-calendar-event-fill' },
            'message': { class: 'info', icon: 'ri-mail-send-fill' }
        };

        return iconMap[type] || { class: 'info', icon: 'ri-notification-fill' };
    },

    attachEvents() {
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                tabs.forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');

                this.currentFilter = e.target.dataset.filter;
                this.loadData();
            });
        });
    },

    async markAsRead(notificationId) {
        try {
            const response = await fetch(`http://localhost:8080/api/notifications/${notificationId}/read`, {
                method: 'PUT'
            });

            const result = await response.json();

            if (result.success) {
                await this.loadData();
            }
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    },

    getRelativeTime(dateString) {
        if (!dateString) return 'Just now';

        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);
        const diffWeek = Math.floor(diffDay / 7);
        const diffMonth = Math.floor(diffDay / 30);

        if (diffSec < 60) return 'Just now';
        if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
        if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
        if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
        if (diffWeek < 4) return `${diffWeek} week${diffWeek > 1 ? 's' : ''} ago`;
        if (diffMonth < 12) return `${diffMonth} month${diffMonth > 1 ? 's' : ''} ago`;

        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Notifications.init());
} else {
    Notifications.init();
}

window.Notifications = Notifications;