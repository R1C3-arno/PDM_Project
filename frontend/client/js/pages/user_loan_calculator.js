document.addEventListener('baseLayoutLoaded', async () => {
    await window.loadPageComponents([
        {
            html: '/frontend/client/components/loan_calculator/index.html',
            targetId: 'loanCalculatorSection',
            js: '/frontend/client/js/components/loan_calculator.js'
        },
        {
            html: '/frontend/client/components/graph/index.html',
            targetId: 'graphSection',
            js: '/frontend/client/js/components/graph.js'
        }
    ]);
});