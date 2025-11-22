// Load login HTML
fetch('/frontend/client/components/authentication/index.html')
    .then(r => r.text())
    .then(html => {
        document.getElementById('authenticationSection').innerHTML = html;
        attachLoginHandler();
    });

// Toggle password visibility
window.togglePassword = function () {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('toggleIcon');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('bx-hide');
        toggleIcon.classList.add('bx-show');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('bx-show');
        toggleIcon.classList.add('bx-hide');
    }
}

// Login handler
function attachLoginHandler() {
    const form = document.querySelector('form');
    if (form) {
        form.onsubmit = function (e) {
            e.preventDefault();

            const email = document.querySelector('input[name="email"]').value;
            const password = document.querySelector('input[name="password"]').value;

            fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password})
            })
                .then(r => r.json())
                .then(user => {
                    if (user && user.id) {
                        localStorage.setItem('user', JSON.stringify(user));

                        // Trigger event để navbar update
                        window.dispatchEvent(new CustomEvent('userLoggedIn'));

                        alert('Login success!');
                        window.location.href = '/client/pages/Main/index.html';
                    } else {
                        alert('Invalid email or password');
                    }
                })
                .catch(err => {
                    console.error(err);
                    alert('Login failed!');
                });
        };
    }
}