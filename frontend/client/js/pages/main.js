window.loadScript = function (src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            console.log(`✓ Loaded script: ${src}`);
            resolve();
        };
        script.onerror = () => {
            console.error(`✗ Error loading script: ${src}`);
            reject();
        };
        document.body.appendChild(script);
    });
}

async function loadComponent(componentPath, targetId) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) throw new Error(`Failed to load ${componentPath}`);
        const html = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const content = doc.body.innerHTML;

        document.getElementById(targetId).innerHTML = content;
        console.log(`✓ Loaded component: ${componentPath}`);
    } catch (error) {
        console.error(`✗ Error loading component ${componentPath}:`, error);
    }
}

// Scroll to hash target with retry mechanism
function scrollToHash(hash, retryCount = 0) {
    const maxRetries = 10;
    const target = document.querySelector(hash);

    if (target) {
        // Element found, scroll to it
        setTimeout(() => {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            console.log(`✓ Scrolled to: ${hash}`);
        }, 100);
    } else if (retryCount < maxRetries) {
        // Element not found yet, retry after delay
        setTimeout(() => {
            scrollToHash(hash, retryCount + 1);
        }, 200);
    } else {
        console.warn(`✗ Could not find target: ${hash}`);
    }
}

// Setup smooth scroll for anchor links
function setupNavbarLinksScroll() {
    // Handle anchor link clicks
    document.querySelectorAll('a[href*="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href) return;

            const [url, hash] = href.split('#');
            if (!hash) return;

            const targetHash = `#${hash}`;
            const currentPath = window.location.pathname;

            // Check if link points to current page
            const isSamePage = !url ||
                url === '' ||
                url === '.' ||
                currentPath.includes(url) ||
                url.includes(currentPath.split('/').pop());

            if (isSamePage) {
                // Same page: prevent default and smooth scroll
                e.preventDefault();
                const target = document.querySelector(targetHash);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    // Update URL without jumping
                    history.pushState(null, '', targetHash);
                }
            }
            // Different page: let browser navigate naturally
            // Hash will be handled by DOMContentLoaded event
        });
    });
    console.log('✓ Navbar scroll links setup complete');
}

async function loadAllComponents() {
    try {
        // Load all HTML components
        await loadComponent('/frontend/client/components/navbar/index.html', 'navbarSection');
        await loadComponent('/frontend/client/components/hero/index.html', 'heroSection');
        await loadComponent('/frontend/client/components/about/index.html', 'aboutSection');
        await loadComponent('/frontend/client/components/projects/index.html', 'projectsSection');
        await loadComponent('/frontend/client/components/testimonials/index.html', 'testimonialsSection');
        await loadComponent('/frontend/client/components/contact/index.html', 'contactSection');
        await loadComponent('/frontend/client/components/footer/index.html', 'footerSection');

        // Load all JS scripts
        await loadScript('/frontend/client/js/components/navbar.js');
        await loadScript('/frontend/client/js/components/hero.js');
        await loadScript('/frontend/client/js/components/about.js');
        await loadScript('/frontend/client/js/components/projects.js');
        await loadScript('/frontend/client/js/components/testimonials.js');
        await loadScript('/frontend/client/js/components/contact.js');
        await loadScript('/frontend/client/js/components/footer.js');

        // Dispatch event that all components are loaded
        document.dispatchEvent(new CustomEvent('componentsLoaded'));
        console.log('✓ All components loaded');

        // Setup smooth scroll for navbar links
        setupNavbarLinksScroll();

        // Handle hash navigation (for cross-page navigation)
        if (window.location.hash) {
            console.log(`→ Handling hash: ${window.location.hash}`);
            scrollToHash(window.location.hash);
        }

    } catch (error) {
        console.error('✗ Error loading components:', error);
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('→ DOM Content Loaded, starting component loading...');
    loadAllComponents();
});