async function loadSection(id, file) {
    try {
        const res = await fetch(file);
        const html = await res.text();
        document.getElementById(id).innerHTML = html;

        const scripts = container.querySelectorAll('script');
        scripts.forEach(script => {
            const newScript = document.createElement('script');
            newScript.textContent = script.textContent;
            document.body.appendChild(newScript);
        });
    } catch (err) {
        console.error("Không load được:", file, err);
    }
}

// Thêm vào cuối file script.js
document.addEventListener('DOMContentLoaded', function() {
    // Load các phần giao diện
    loadSection("navbar", "Home_Section/navbar.html");
    loadSection("hero", "Home_Section/hero.html");
    loadSection("banner", "Home_Section/banner.html");
    loadSection("features", "Home_Section/features.html");
});