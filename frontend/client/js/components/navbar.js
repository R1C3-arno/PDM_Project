function updateNavbar() {
    const user = JSON.parse(localStorage.getItem('user'));
    const loginButton = document.getElementById('loginButton');
    const userAvatar = document.getElementById('userAvatar');

    if (user?.id) {
        if (loginButton) loginButton.style.display = 'none';
        if (userAvatar) userAvatar.style.display = 'flex';

        const userName = user.fullName || user.email.split('@')[0];
        const avatarImg = document.getElementById('userAvatarImg');

        if (avatarImg) avatarImg.src = user.avatar || '/client/assets/images/default_avatar.jpg';

        const userNameDisplay = document.getElementById('userNameDisplay');
        if (userNameDisplay) userNameDisplay.textContent = userName;

        const dropdownUserName = document.getElementById('dropdownUserName');
        const dropdownUserEmail = document.getElementById('dropdownUserEmail');
        if (dropdownUserName) dropdownUserName.textContent = userName;
        if (dropdownUserEmail) dropdownUserEmail.textContent = user.email;
    } else {
        if (loginButton) loginButton.style.display = 'block';
        if (userAvatar) userAvatar.style.display = 'none';
    }
}

window.handleLogout = function() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('user');
        window.location.href = '/client/pages/Authentication/index.html';
    }
}

setTimeout(updateNavbar, 100);
setTimeout(updateNavbar, 500);
setInterval(updateNavbar, 2000);