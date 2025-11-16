// Function load component
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();

        const element = document.getElementById(elementId);
        if (!element) {
            console.error(`Element #${elementId} not found`);
            return;
        }

        element.innerHTML = html;

        // Nếu load header, khởi tạo event listeners
        if (elementId === 'header-section') {
            initHeaderToggle();
        }

    } catch (error) {
        console.error(`Error loading ${componentPath}:`, error);
    }
}

// Xử lý toggle sidebar từ header
function initHeaderToggle() {
    const headerToggle = document.getElementById('header-toggle');
    const mainContent = document.getElementById('main-content');

    if (headerToggle) {
        headerToggle.addEventListener('click', function() {
            document.body.classList.toggle('sidebar-hidden');

            // Toggle main content width
            if (mainContent) {
                if (document.body.classList.contains('sidebar-hidden')) {
                    mainContent.classList.remove('ml-64');
                    mainContent.classList.add('ml-0');
                } else {
                    mainContent.classList.remove('ml-0');
                    mainContent.classList.add('ml-64');
                }
            }

            // Thay đổi icon
            const icon = this.querySelector('i');
            if (icon) {
                if (document.body.classList.contains('sidebar-hidden')) {
                    icon.className = 'ri-menu-unfold-line';
                } else {
                    icon.className = 'ri-menu-line';
                }
            }
        });
    }
}

// Khởi tạo khi DOM ready
document.addEventListener('DOMContentLoaded', function() {
    loadComponent('header-section', '/frontend/server/components/header/header.html');
});