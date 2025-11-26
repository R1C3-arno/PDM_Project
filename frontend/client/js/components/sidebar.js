if (!window.sidebarInitialized) {
    window.sidebarInitialized = true;

    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.id && !user.error) {
        fetch(`http://localhost:8080/api/users/${user.id}`)
            .then(r => r.json())
            .then(data => {
                if (data.id) {
                    document.getElementById('userName').textContent = data.fullName || 'User';
                    document.getElementById('userEmail').textContent = data.email || '';

                    if (data.avatar) {
                        document.getElementById('userAvatar').src = data.avatar;
                    }

                    localStorage.setItem('user', JSON.stringify(data));
                }
            });
    } else {
        document.getElementById('userName').textContent = user?.fullName || 'User';
        document.getElementById('userEmail').textContent = user?.email || '';
    }

    const showSidebar = (toggleId, sidebarId, headerId, mainId) => {
        const toggle = document.getElementById(toggleId),
            sidebar = document.getElementById(sidebarId),
            header = document.getElementById(headerId),
            main = document.getElementById(mainId)

        if(toggle && sidebar && header && main){
            toggle.addEventListener('click', () => {
                sidebar.classList.toggle('show-sidebar')
                header.classList.toggle('left-pd')
            })
        }
    }
    showSidebar('header-toggle','sidebar', 'header', 'main')

    const sidebarLinks = document.querySelectorAll('.sidebar__list a')
    const currentPath = window.location.pathname;

    sidebarLinks.forEach(link => {
        if (link.href.includes(currentPath)) {
            link.classList.add('active-link');
        } else {
            link.classList.remove('active-link');
        }
    });

    const themeButton = document.getElementById('theme-button')
    const darkTheme = 'dark-theme'
    const iconTheme = 'ri-sun-fill'

    const selectedTheme = localStorage.getItem('selected-theme')
    const selectedIcon = localStorage.getItem('selected-icon')

    const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
    const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'ri-moon-clear-fill' : 'ri-sun-fill'

    if (selectedTheme) {
        document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
        themeButton.classList[selectedIcon === 'ri-moon-clear-fill' ? 'add' : 'remove'](iconTheme)
    }

    themeButton.addEventListener('click', () => {
        document.body.classList.toggle(darkTheme)
        themeButton.classList.toggle(iconTheme)
        localStorage.setItem('selected-theme', getCurrentTheme())
        localStorage.setItem('selected-icon', getCurrentIcon())
    })
}

window.logout = function() {
    localStorage.removeItem('user');
    localStorage.removeItem('loanApplication');
    window.location.href = '/frontend/client/pages/Authentication/index.html';
}



const img = document.getElementById("userAvatar");

img.addEventListener("error", () => {
    img.src = "/frontend/client/assets/images/default_avatar.jpg";
});
