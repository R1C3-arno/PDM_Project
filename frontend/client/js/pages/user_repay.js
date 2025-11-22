document.addEventListener('baseLayoutLoaded', async () => {
    await window.loadPageComponents([
        {
            html: '/frontend/client/components/repay_documentation/index.html',
            targetId: 'loanRepaySection',
            js: '/frontend/client/js/components/repay_documentation.js'
        }
    ]);

    // Khi component đã load, scroll tới hash nếu có
    const hash = window.location.hash;
    if(hash) {
        const target = document.querySelector(hash);
        if(target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Attach smooth scroll cho anchor
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
