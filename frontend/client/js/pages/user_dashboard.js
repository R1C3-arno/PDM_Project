 // Load dashboard page
// Use this in your main routing file

document.addEventListener('componentsLoaded', () => {
    console.log('Loading dashboard page...');

    fetch('/frontend/client/components/dashboard/index.html')
        .then(r => r.text())
        .then(html => {
            const mainContainer = document.querySelector('.main__container');
            if (mainContainer) {
                mainContainer.innerHTML = html;
            }

            // Load scripts in order
            return loadScripts([
                '/frontend/client/js/config/dashboard/api-config.js',
                '/frontend/client/js/components/dashboard_components/util.js',
                '/frontend/client/js/components/dashboard_components/api.js',
                '/frontend/client/js/components/dashboard_components/title.js',
                '/frontend/client/js/components/dashboard_components/stats.js',
                '/frontend/client/js/components/dashboard_components/charts.js',
                '/frontend/client/js/components/dashboard_components/transactions.js',
                '/frontend/client/js/components/dashboard.js'
            ]);
        })
        .catch(error => {
            console.error('Error loading dashboard:', error);
        });
});

// Helper function to load scripts sequentially
function loadScripts(scripts) {
    return scripts.reduce((promise, script) => {
        return promise.then(() => loadScript(script));
    }, Promise.resolve());
}

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
}