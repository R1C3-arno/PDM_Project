document.addEventListener('baseLayoutLoaded', async () => {
    await window.loadPageComponents([
        {
            html: '/frontend/client/components/authentication/index.html',
            targetId: 'authenticationSection',
            js: '/frontend/client/js/components/authentication.js'
        }
    ]);
});
