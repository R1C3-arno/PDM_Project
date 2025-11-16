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

        // Nếu load sidebar, khởi tạo event listeners
        if (elementId === 'sidebar-section') {
            initSidebarEvents();
        }

    } catch (error) {
        console.error(`Error loading ${componentPath}:`, error);
    }
}

// Xử lý sự kiện sidebar
function initSidebarEvents() {
    const sidebarItems = document.querySelectorAll('.sidebar-item');

    sidebarItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault(); // Ngăn link reload trang

            // Remove active class from all items
            sidebarItems.forEach(i => {
                i.classList.remove('active', 'bg-green-50', 'text-green-600');
                i.classList.add('text-gray-700');
            });

            // Add active class to clicked item
            this.classList.add('active', 'bg-green-50', 'text-green-600');
            this.classList.remove('text-gray-700');
        });
    });
}

// Khởi tạo khi DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // QUAN TRỌNG: Phải truyền đầy đủ tham số
    loadComponent('sidebar-section', '/frontend/server/components/sidebar/sidebar.html');
});