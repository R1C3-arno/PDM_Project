document.addEventListener('baseLayoutLoaded', async () => {
    await window.loadPageComponents([
        {
            html: '/frontend/client/components/loan_application/index.html',
            targetId: 'loanApplicationSection',
            js: '/frontend/client/js/components/loan_application.js'
        }
    ]);
});