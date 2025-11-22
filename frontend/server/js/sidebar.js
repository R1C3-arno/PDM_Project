// Function load HTML component
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) throw new Error(`Failed to load ${componentPath}`);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const content = doc.body.innerHTML;

        document.getElementById(elementId).innerHTML = content;
        console.log(`✓ Sidebar loaded: ${componentPath}`);

        // Init events after loading
        if (elementId === 'sidebar-section') initSidebarEvents();

    } catch (error) {
        console.error(`✗ Error loading sidebar: ${componentPath}`, error);
    }
}

// Init sidebar links
function initSidebarEvents() {
    const sidebarItems = document.querySelectorAll('.sidebar-item');

    sidebarItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;

            const [url, hash] = href.split('#');
            const currentPath = window.location.pathname;

            const isSamePage = !url || currentPath.includes(url);

            if (isSamePage) {
                // Same page: prevent reload
                e.preventDefault();

                // Update active classes
                sidebarItems.forEach(i => {
                    i.classList.remove('active', 'bg-green-50', 'text-green-600');
                    i.classList.add('text-gray-700');
                });
                this.classList.add('active', 'bg-green-50', 'text-green-600');
                this.classList.remove('text-gray-700');

                // Scroll to hash if exists
                if (hash) {
                    const target = document.getElementById(hash) || document.querySelector(`#${hash}`);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        history.pushState(null, '', `#${hash}`);
                    }
                }
            } else {
                // Different page: allow natural navigation
                console.log(`→ Navigate to: ${href}`);
            }
        });
    });
}

// Initialize sidebar when DOM ready
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('sidebar-section', '/frontend/server/components/sidebar/sidebar.html');
});
