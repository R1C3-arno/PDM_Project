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
    } catch (error) {
    }
}

async function loadAllComponents() {
    try {
        await loadComponent('/frontend/client/components/navbar/index.html', 'navbarSection');
        await loadComponent('/frontend/client/components/hero/index.html', 'heroSection');
        await loadComponent('/frontend/client/components/about/index.html', 'aboutSection');
        await loadComponent('/frontend/client/components/projects/index.html', 'projectsSection');
        await loadComponent('/frontend/client/components/testimonials/index.html', 'testimonialsSection');
        await loadComponent('/frontend/client/components/contact/index.html', 'contactSection');
        await loadComponent('/frontend/client/components/footer/index.html', 'footerSection');


        await loadScript('/frontend/client/js/components/navbar.js');
        await loadScript('/frontend/client/js/components/hero.js');
        await loadScript('/frontend/client/js/components/about.js');
        await loadScript('/frontend/client/js/components/projects.js');
        await loadScript('/frontend/client/js/components/testimonials.js');
        await loadScript('/frontend/client/js/components/contact.js');
        await loadScript('/frontend/client/js/components/footer.js');


        document.dispatchEvent(new CustomEvent('componentsLoaded'));
    } catch (error) {
    }
}

document.addEventListener('DOMContentLoaded', loadAllComponents);