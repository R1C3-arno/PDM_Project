// Load main content (bảng users)
fetch('/frontend/server/components/user_management/main.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('mainContent').innerHTML = html;
    });


fetch('/frontend/server/components/user_management/popup.html')  // Đường dẫn tương đối
    .then(response => response.text())
    .then(html => {
        document.getElementById('popupContainer').innerHTML = html;
    });

fetch('/frontend/server/components/user_management/edit.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('editPopupContainer').innerHTML = html;
    });


// Data users
const users = {
    'U001': {
        id: '#U001',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+84 912 345 678',
        role: 'Admin',
        status: 'Active',
        created: 'Jan 15, 2025',
        lastLogin: 'Nov 16, 2025 14:30',
        avatar: 'JD'
    },
    'U002': {
        id: '#U002',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+84 987 654 321',
        role: 'User',
        status: 'Active',
        created: 'Jan 14, 2025',
        lastLogin: 'Nov 15, 2025 09:15',
        avatar: 'JS'
    },
    'U003': {
        id: '#U003',
        name: 'Mike Johnson',
        email: 'mike.j@example.com',
        phone: '+84 901 234 567',
        role: 'Manager',
        status: 'Inactive',
        created: 'Jan 10, 2025',
        lastLogin: 'Nov 10, 2025 16:45',
        avatar: 'MJ'
    },
    'U004': {
        id: '#U004',
        name: 'Sarah Lee',
        email: 'sarah.lee@example.com',
        phone: '+84 909 876 543',
        role: 'User',
        status: 'Suspended',
        created: 'Jan 12, 2025',
        lastLogin: 'Nov 05, 2025 11:20',
        avatar: 'SL'
    }
};

// Mở popup
function openUserPopup(userId) {
    const user = users[userId];
    if (!user) return;

    // Fill data
    document.getElementById('popupId').textContent = user.id;
    document.getElementById('popupName').textContent = user.name;
    document.getElementById('popupEmail').textContent = user.email;
    document.getElementById('popupPhone').textContent = user.phone;
    document.getElementById('popupCreated').textContent = user.created;
    document.getElementById('popupLastLogin').textContent = user.lastLogin;
    document.getElementById('popupAvatar').textContent = user.avatar;
    document.getElementById('popupRole').textContent = user.role;
    document.getElementById('popupStatus').textContent = user.status;

    // Show popup
    document.getElementById('userPopup').classList.remove('hidden');
}

// Đóng popup
function closeUserPopup() {
    document.getElementById('userPopup').classList.add('hidden');
}

// Đóng khi click ngoài
document.getElementById('userPopup').addEventListener('click', function(e) {
    if (e.target === this) {
        closeUserPopup();
    }
});

// Đóng khi nhấn ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeUserPopup();
    }
});


function openEditPopup(userId) {
    const user = users[userId];
    if (!user) return;

    // Fill data vào form
    document.getElementById('editUserId').value = user.id;
    document.getElementById('editUserName').value = user.name;
    document.getElementById('editUserEmail').value = user.email;
    document.getElementById('editUserPhone').value = user.phone;
    document.getElementById('editUserRole').value = user.role;
    document.getElementById('editUserStatus').value = user.status;
    document.getElementById('editUserCreated').value = user.created;

    // Show popup
    document.getElementById('editUserPopup').classList.remove('hidden');
}

function closeEditPopup() {
    document.getElementById('editUserPopup').classList.add('hidden');
}

function saveUserEdit() {
    // Lấy data từ form
    const userId = document.getElementById('editUserId').value;
    // Logic save ở đây

    alert('User updated!');
    closeEditPopup();
}