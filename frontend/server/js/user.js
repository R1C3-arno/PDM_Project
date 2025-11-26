fetch('/frontend/server/components/user_management/main.html')
    .then(r => r.text())
    .then(html => {
        document.getElementById('mainContent').innerHTML = html;
        loadUsers();
    });

fetch('/frontend/server/components/user_management/view.html')
    .then(r => r.text())
    .then(html => document.getElementById('popupContainer').innerHTML = html);

fetch('/frontend/server/components/user_management/edit.html')
    .then(r => r.text())
    .then(html => document.getElementById('editPopupContainer').innerHTML = html);

let currentUser = null;

function loadUsers() {
    fetch('/api/users')
        .then(r => r.json())
        .then(users => {
            const tbody = document.querySelector('tbody');
            tbody.innerHTML = users.map(user => {
                const roleColors = {
                    'Admin': 'bg-purple-100 text-purple-600',
                    'User': 'bg-blue-100 text-blue-600',
                    'Manager': 'bg-orange-100 text-orange-600'
                };
                const statusColors = {
                    'Active': 'bg-green-100 text-green-600',
                    'Inactive': 'bg-gray-100 text-gray-600',
                    'Suspended': 'bg-red-100 text-red-600'
                };

                return `
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 text-sm font-semibold">#${user.id}</td>
                        <td class="px-6 py-4 text-sm">${user.fullName}</td>
                        <td class="px-6 py-4 text-sm">${user.email}</td>
                        <td class="px-6 py-4 text-sm">${user.phone || 'N/A'}</td>
                        <td class="px-6 py-4">
                            <span class="px-3 py-1 text-xs rounded-full ${roleColors[user.role] || 'bg-gray-100 text-gray-600'}">${user.role}</span>
                        </td>
                        <td class="px-6 py-4">
                            <span class="px-3 py-1 text-xs rounded-full ${statusColors[user.status] || 'bg-gray-100 text-gray-600'}">${user.status}</span>
                        </td>
                        <td class="px-6 py-4 text-sm">${new Date(user.createdAt).toLocaleDateString()}</td>
                        <td class="px-6 py-4">
                            <div class="flex gap-2">
                                <button onclick="openUserPopup(${user.id})" class="text-blue-600 hover:text-blue-800">👁️</button>
                                <button onclick="openEditPopup(${user.id})" class="text-yellow-600 hover:text-yellow-800">✏️</button>
                                <button onclick="deleteUser(${user.id})" class="text-red-600 hover:text-red-800">🗑️</button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
        });
}

window.openUserPopup = function(id) {
    fetch(`/api/users/${id}`)
        .then(r => r.json())
        .then(user => {
            currentUser = user;

            const roleColors = {
                'Admin': 'bg-purple-100 text-purple-600',
                'User': 'bg-blue-100 text-blue-600',
                'Manager': 'bg-orange-100 text-orange-600'
            };
            const statusColors = {
                'Active': 'bg-green-100 text-green-600',
                'Inactive': 'bg-gray-100 text-gray-600',
                'Suspended': 'bg-red-100 text-red-600'
            };

            const initials = user.fullName.split(' ').map(n => n[0]).join('').toUpperCase();
            document.getElementById('popupAvatar').textContent = initials;
            document.getElementById('popupName').textContent = user.fullName;
            document.getElementById('popupId').textContent = `#${user.id}`;
            document.getElementById('popupEmail').textContent = user.email;
            document.getElementById('popupPhone').textContent = user.phone || 'N/A';

            const roleEl = document.getElementById('popupRole');
            roleEl.textContent = user.role;
            roleEl.className = `px-3 py-1 text-xs rounded-full ${roleColors[user.role] || 'bg-gray-100 text-gray-600'}`;

            const statusEl = document.getElementById('popupStatus');
            statusEl.textContent = user.status;
            statusEl.className = `px-3 py-1 text-xs rounded-full ${statusColors[user.status] || 'bg-gray-100 text-gray-600'}`;

            document.getElementById('popupCreated').textContent = new Date(user.createdAt).toLocaleDateString();
            document.getElementById('popupLastLogin').textContent = user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A';

            document.getElementById('userPopup').classList.remove('hidden');
        });
}

window.closeUserPopup = function() {
    document.getElementById('userPopup').classList.add('hidden');
}

window.openEditPopup = function(id) {
    fetch(`/api/users/${id}`)
        .then(r => r.json())
        .then(user => {
            currentUser = user;

            document.getElementById('editUserId').value = user.id;
            document.getElementById('editUserName').value = user.fullName;
            document.getElementById('editUserEmail').value = user.email;
            document.getElementById('editUserPhone').value = user.phone || '';
            document.getElementById('editUserRole').value = user.role;
            document.getElementById('editUserStatus').value = user.status;
            document.getElementById('editUserCreated').value = new Date(user.createdAt).toLocaleDateString();

            document.getElementById('editUserPopup').classList.remove('hidden');
        });
}

window.closeEditPopup = function() {
    document.getElementById('editUserPopup').classList.add('hidden');
}

window.saveUserEdit = function() {
    const id = currentUser.id;
    const data = {
        fullName: document.getElementById('editUserName').value,
        email: document.getElementById('editUserEmail').value,
        phone: document.getElementById('editUserPhone').value,
        role: document.getElementById('editUserRole').value,
        status: document.getElementById('editUserStatus').value,
        password: currentUser.password,
        address: currentUser.address,
        avatar: currentUser.avatar
    };

    fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(() => {
        closeEditPopup();
        loadUsers();
        alert('User updated successfully!');
    });
}

window.deleteUser = function(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        fetch(`/api/users/${id}`, {
            method: 'DELETE'
        }).then(() => {
            loadUsers();
            alert('User deleted successfully!');
        });
    }
}