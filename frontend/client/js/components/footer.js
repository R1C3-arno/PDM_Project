console.log('Footer script loaded');

function animateFooter() {
    const footer = document.getElementById("Footer");

    if (!footer) {
        console.error('Footer element not found');
        return;
    }

    setTimeout(() => {
        footer.classList.remove("opacity-0", "translate-y-6");
        footer.classList.add("opacity-100", "translate-y-0");
        console.log('Footer animation triggered');
    }, 100);

    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                footer.classList.remove("opacity-0", "translate-y-6");
                footer.classList.add("opacity-100", "translate-y-0");
            }
        });
    }, observerOptions);

    observer.observe(footer);
}

function initNewsletterForm() {
    const form = document.getElementById("newsletterForm");
    const emailInput = document.getElementById("newsletterEmail");
    const msg = document.getElementById("newsletterMsg");

    if (!form || !emailInput || !msg) {
        console.error('Newsletter form elements not found');
        return;
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (emailInput.value.trim() !== "") {
            msg.classList.remove("hidden");
            emailInput.value = "";
            setTimeout(() => msg.classList.add("hidden"), 3000);
        }
    });
}


function initFooter() {
    console.log('Initializing footer...');
    animateFooter();
    initNewsletterForm();
}


if (document.getElementById("Footer")) {
    initFooter();
} else {
    document.addEventListener('componentsLoaded', initFooter);

    setTimeout(() => {
        if (document.getElementById("Footer")) {
            initFooter();
        }
    }, 500);
}