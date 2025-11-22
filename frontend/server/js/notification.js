fetch('/frontend/server/components/notification_management/main.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('mainContent').innerHTML = html;
    });

fetch('/frontend/server/components/notification_management/view.html')  // Đường dẫn tương đối
    .then(response => response.text())
    .then(html => {
        document.getElementById('popupContainer').innerHTML = html;
    });

fetch('/frontend/server/components/notification_management/new.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('newContainer').innerHTML = html;
    });



// Toggle send notification form
document.querySelector('.bg-green-500').addEventListener('click', function() {
    const form = document.getElementById('send-notification-form');
    form.classList.toggle('hidden');
});


// View
function openNotificationPopup(notiId) {
    const notifications = {
        'N001': {
            id: '#N001',
            userId: 'U12345',
            title: 'Loan.java Approved',
            message: 'Your loan application has been approved',
            type: 'Success',
            status: 'Read',
            created: 'Jan 15, 2025'
        },
        'N002': {
            id: '#N002',
            userId: 'U12345',
            title: 'Loan.java Approved',
            message: 'Your loan application has been approved',
            type: 'Success',
            status: 'Read',
            created: 'Jan 15, 2025'
        }
    };

    const noti = notifications[notiId];
    document.getElementById('notiPopupId').textContent = noti.id;
    document.getElementById('notiPopupTitle').textContent = noti.title;
    document.getElementById('notiPopupUserId').textContent = noti.userId;
    document.getElementById('notiPopupMessage').textContent = noti.message;
    document.getElementById('notiPopupType').textContent = noti.type;
    document.getElementById('notiPopupStatus').textContent = noti.status;
    document.getElementById('notiPopupCreated').textContent = noti.created;

    document.getElementById('notificationPopup').classList.remove('hidden');
}

function closeNotificationPopup() {
    document.getElementById('notificationPopup').classList.add('hidden');
}




// New Notification
function openNewNotificationPopup() {
    // Auto-generate new Notification ID
    const newId = '#N' + String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    document.getElementById('newNotificationId').value = newId;

    // Set default created date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('newNotificationCreated').value = today;

    // Reset form
    document.getElementById('newNotificationForm').reset();
    document.getElementById('newNotificationId').value = newId;
    document.getElementById('newNotificationCreated').value = today;
    document.getElementById('newNotificationPriority').value = 'Medium';

    document.getElementById('newNotificationPopup').classList.remove('hidden');
}

function closeNewNotificationPopup() {
    document.getElementById('newNotificationPopup').classList.add('hidden');
}

function createNewNotification() {
    // Get form values
    const newNotification = {
        id: document.getElementById('newNotificationId').value,
        userId: document.getElementById('newNotificationUserId').value,
        title: document.getElementById('newNotificationTitle').value,
        message: document.getElementById('newNotificationMessage').value,
        type: document.getElementById('newNotificationType').value,
        created: document.getElementById('newNotificationCreated').value,
        priority: document.getElementById('newNotificationPriority').value,
        sendNow: document.getElementById('newNotificationSendNow').checked
    };

    // Validate required fields
    if (!newNotification.userId || !newNotification.title || !newNotification.message ||
        !newNotification.type || !newNotification.status || !newNotification.created) {
        alert('Please fill in all required fields!');
        return;
    }

    // Validate title length
    if (newNotification.title.length < 3) {
        alert('Title must be at least 3 characters long!');
        return;
    }

    // Validate message length
    if (newNotification.message.length < 10) {
        alert('Message must be at least 10 characters long!');
        return;
    }

    console.log('Creating new notification:', newNotification);

    // TODO: Send to backend API
    if (newNotification.sendNow) {
        alert('Notification created and sent successfully!');
    } else {
        alert('Notification created successfully!');
    }

    closeNewNotificationPopup();
}