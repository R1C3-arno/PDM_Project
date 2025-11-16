// header.js
// Có thể thêm các animations hoặc interactive effects cho header tại đây

document.addEventListener('DOMContentLoaded', () => {
    console.log('Hero component loaded');

    // Thêm smooth scroll cho các links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});