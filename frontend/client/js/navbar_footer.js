window.loadScript = function (src) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.body.appendChild(script);
    });
}

async function loadComponent(componentPath, targetId) {
    const response = await fetch(componentPath);
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${componentPath}`);
    }

    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const content = doc.body.innerHTML;

    const target = document.getElementById(targetId);
    if (!target) {
        throw new Error(`Target #${targetId} not found`);
    }

    target.innerHTML = content;
}

function forceShowFooter() {
    const footer = document.getElementById('Footer');
    if (footer) {
        setTimeout(() => {
            footer.classList.remove('opacity-0', 'translate-y-6');
            footer.classList.add('opacity-100', 'translate-y-0');
        }, 100);
    }
}

async function loadBaseLayout() {
    await loadComponent('/frontend/client/components/navbar/index.html', 'navbarSection');
    await loadScript('/frontend/client/js/components/navbar.js');

    await loadComponent('/frontend/client/components/footer/index.html', 'footerSection');
    await loadScript('/frontend/client/js/components/footer.js');

    document.dispatchEvent(new CustomEvent('baseLayoutLoaded'));
    document.dispatchEvent(new CustomEvent('componentsLoaded'));

    setTimeout(forceShowFooter, 200);
}

window.loadPageComponents = async function(components) {
    try {
        for (const component of components) {
            await loadComponent(component.html, component.targetId);
            await new Promise(resolve => requestAnimationFrame(resolve));

            if (component.js) {
                const scriptContent = await fetch(component.js).then(r => r.text());
                const wrappedScript = `
                    (function() {
                        setTimeout(function() {
                            ${scriptContent}
                        }, 0);
                    })();
                `;

                const scriptElement = document.createElement('script');
                scriptElement.textContent = wrappedScript;
                scriptElement.setAttribute('data-component', component.targetId);
                document.body.appendChild(scriptElement);

                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
        document.dispatchEvent(new CustomEvent('pageComponentsLoaded'));
    } catch (error) {
    }
}

document.addEventListener('DOMContentLoaded', loadBaseLayout);