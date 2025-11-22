window.loadScript = function (src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
}

Promise.all([
    fetch('/frontend/client/components/header/index.html').then(r => r.text()),
    fetch('/frontend/client/components/sidebar/index.html').then(r => r.text())
]).then(([headerHTML, sidebarHTML]) => {
    document.getElementById('header-container').innerHTML = headerHTML;
    document.getElementById('sidebar-container').innerHTML = sidebarHTML;
    return loadScript('/frontend/client/js/components/sidebar.js');
}).then(() => {
    document.dispatchEvent(new CustomEvent('componentsLoaded'));
}).catch(error => {
});