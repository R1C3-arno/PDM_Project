fetch('/frontend/server/components/notification_management/main.html')
    .then(r => r.text())
    .then(html => {
        document.getElementById('mainContent').innerHTML = html;
        loadNotifications();
    });

fetch('/frontend/server/components/notification_management/view.html')
    .then(r => r.text())
    .then(html => document.getElementById('popupContainer').innerHTML = html);

fetch('/frontend/server/components/notification_management/new.html')
    .then(r => r.text())
    .then(html => document.getElementById('newContainer').innerHTML = html);


function loadNotifications() {
    fetch('/api/notifications')
        .then(r => r.json())
        .then(notifications => {
            const tbody = document.querySelector('tbody');
            tbody.innerHTML = notifications.map(noti => {
                const typeColors = {
                    'Success': 'bg-green-100 text-green-600',
                    'Info': 'bg-blue-100 text-blue-600',
                    'Warning': 'bg-yellow-100 text-yellow-600',
                    'Error': 'bg-red-100 text-red-600'
                };
                const statusColor = noti.isRead ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600';
                const rowBg = noti.isRead ? '' : 'bg-yellow-50';

                return `
                    <tr class="hover:bg-gray-50 ${rowBg}">
                        <td class="px-6 py-4 text-sm font-semibold">#${noti.id}</td>
                        <td class="px-6 py-4 text-sm">${noti.userId}</td>
                        <td class="px-6 py-4 text-sm font-semibold">${noti.title}</td>
                        <td class="px-6 py-4 text-sm">${noti.message.substring(0, 50)}...</td>
                        <td class="px-6 py-4">
                            <span class="px-3 py-1 text-xs rounded-full ${typeColors[noti.type] || 'bg-gray-100 text-gray-600'}">${noti.type}</span>
                        </td>
                        <td class="px-6 py-4">
                            <span class="px-3 py-1 text-xs rounded-full ${statusColor}">${noti.isRead ? 'Read' : 'Unread'}</span>
                        </td>
                        <td class="px-6 py-4 text-sm">${noti.createdAt || 'N/A'}</td>
                        <td class="px-6 py-4">
                            <div class="flex gap-2">
                                <button onclick="openNotificationPopup(${noti.id})" class="text-blue-600 hover:text-blue-800">👁️</button>
                                <button onclick="deleteNotification(${noti.id})" class="text-red-600 hover:text-red-800">🗑️</button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
        });
}


window.openNotificationPopup = function(id) {
    fetch(`/api/notifications/${id}`)
        .then(r => r.json())
        .then(noti => {
            const typeColors = {
                'Success': 'bg-green-100 text-green-600',
                'Info': 'bg-blue-100 text-blue-600',
                'Warning': 'bg-yellow-100 text-yellow-600',
                'Error': 'bg-red-100 text-red-600'
            };
            const statusColor = noti.isRead ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600';

            document.getElementById('notiPopupId').textContent = `#${noti.id}`;
            document.getElementById('notiPopupTitle').textContent = noti.title;
            document.getElementById('notiPopupUserId').textContent = noti.userId;
            document.getElementById('notiPopupMessage').textContent = noti.message;
            document.getElementById('notiPopupCreated').textContent = noti.createdAt || 'N/A';

            const typeEl = document.getElementById('notiPopupType');
            typeEl.textContent = noti.type;
            typeEl.className = `px-3 py-1 text-xs rounded-full ${typeColors[noti.type] || 'bg-gray-100 text-gray-600'}`;

            const statusEl = document.getElementById('notiPopupStatus');
            statusEl.textContent = noti.isRead ? 'Read' : 'Unread';
            statusEl.className = `px-3 py-1 text-xs rounded-full ${statusColor}`;

            document.getElementById('notificationPopup').classList.remove('hidden');
        });
}

window.closeNotificationPopup = function() {
    document.getElementById('notificationPopup').classList.add('hidden');
}


window.openNewNotificationPopup = function() {
    document.getElementById('newNotificationForm').reset();
    document.getElementById('newNotificationPopup').classList.remove('hidden');
}

window.closeNewNotificationPopup = function() {
    document.getElementById('newNotificationPopup').classList.add('hidden');
}

window.createNewNotification = function() {
    const data = {
        userId: document.getElementById('newNotificationUserId').value,
        title: document.getElementById('newNotificationTitle').value,
        message: document.getElementById('newNotificationMessage').value,
        type: document.getElementById('newNotificationType').value,
        isRead: false
    };

    fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(() => {
        closeNewNotificationPopup();
        loadNotifications();
        alert('Notification created successfully!');
    });
}


window.deleteNotification = function(id) {
    if (confirm('Delete this notification?')) {
        fetch(`/api/notifications/${id}`, { method: 'DELETE' })
            .then(() => {
                loadNotifications();
                alert('Notification deleted successfully!');
            });
    }
}