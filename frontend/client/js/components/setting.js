const Settings = {
    userId: null,

    async init() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) {
            alert('Please login first!');
            window.location.href = '/frontend/client/pages/Authentication/index.html';
            return;
        }

        this.userId = user.id;
        await this.loadUserData();
        this.attachEvents();
    },

    async loadUserData() {
        try {
            const response = await fetch(`http://localhost:8080/api/users/${this.userId}`);
            const userData = await response.json();

            this.renderProfile(userData);
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    },

    renderProfile(user) {
        document.getElementById('fullName').value = user.fullName || '';
        document.getElementById('email').value = user.email || '';
        document.getElementById('phone').value = user.phone || '';
        document.getElementById('address').value = user.address || '';

        if (user.avatar) {
            document.getElementById('avatarImage').src = user.avatar;
        }
    },

    attachEvents() {
        // Save Profile
        document.getElementById('saveProfileBtn').addEventListener('click', () => this.saveProfile());

        // Change Password
        document.getElementById('changePasswordBtn').addEventListener('click', () => this.showPasswordModal());
        document.getElementById('cancelPasswordBtn').addEventListener('click', () => this.hidePasswordModal());
        document.getElementById('submitPasswordBtn').addEventListener('click', () => this.changePassword());

        // Delete Account
        document.getElementById('deleteAccountBtn').addEventListener('click', () => this.deleteAccount());

        // Avatar Upload
        document.getElementById('avatarInput').addEventListener('change', (e) => this.handleAvatarUpload(e));
    },

    async saveProfile() {
        const profileData = {
            fullName: document.getElementById('fullName').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value
        };

        try {
            const response = await fetch(`http://localhost:8080/api/users/${this.userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData)
            });

            const updatedUser = await response.json();

            // Update localStorage
            const currentUser = JSON.parse(localStorage.getItem('user'));
            currentUser.fullName = updatedUser.fullName;
            currentUser.phone = updatedUser.phone;
            currentUser.address = updatedUser.address;
            localStorage.setItem('user', JSON.stringify(currentUser));

            alert('Profile updated successfully!');
            this.loadUserData();
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Failed to update profile');
        }
    },

    showPasswordModal() {
        document.getElementById('passwordModal').style.display = 'block';
    },

    hidePasswordModal() {
        document.getElementById('passwordModal').style.display = 'none';
        document.getElementById('oldPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
    },

    async changePassword() {
        const oldPassword = document.getElementById('oldPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!oldPassword || !newPassword || !confirmPassword) {
            alert('Please fill in all password fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/users/${this.userId}/password`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    oldPassword: oldPassword,
                    newPassword: newPassword
                })
            });

            const result = await response.json();

            if (result.success) {
                alert('Password changed successfully!');
                this.hidePasswordModal();
            } else {
                alert(result.message || 'Failed to change password');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            alert('Failed to change password');
        }
    },

    async deleteAccount() {
        const confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone!');
        if (!confirmed) return;

        const doubleConfirm = confirm('This will permanently delete all your data. Are you absolutely sure?');
        if (!doubleConfirm) return;

        try {
            const response = await fetch(`http://localhost:8080/api/users/${this.userId}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (result.success) {
                alert('Account deleted successfully');
                localStorage.removeItem('user');
                window.location.href = '/frontend/client/pages/Authentication/index.html';
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('Failed to delete account');
        }
    },

    handleAvatarUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Check file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('Image size must be less than 2MB');
            return;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Preview image
        const reader = new FileReader();
        reader.onload = (e) => {
            const avatarUrl = e.target.result;
            document.getElementById('avatarImage').src = avatarUrl;

            // Save to backend
            this.updateAvatar(avatarUrl);
        };
        reader.readAsDataURL(file);
    },

    async updateAvatar(avatarUrl) {
        try {
            const response = await fetch(`http://localhost:8080/api/users/${this.userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ avatar: avatarUrl })
            });

            const updatedUser = await response.json();

            // Update localStorage
            const currentUser = JSON.parse(localStorage.getItem('user'));
            currentUser.avatar = updatedUser.avatar;
            localStorage.setItem('user', JSON.stringify(currentUser));

            alert('Avatar updated successfully!');
        } catch (error) {
            console.error('Error updating avatar:', error);
            alert('Failed to update avatar');
        }
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Settings.init());
} else {
    Settings.init();
}

window.Settings = Settings;