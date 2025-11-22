document.addEventListener('DOMContentLoaded', () => {
    console.log('Contact component loaded');

    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const name = formData.get('Name');
        const email = formData.get('Email');
        const message = formData.get('Message');

        console.log('Contact form submitted:', {
            name,
            email,
            message
        });

        alert('Message sent successfully!');

        contactForm.reset();
    });
});