document.addEventListener('DOMContentLoaded', () => {

    document.body.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        document.body.style.background = `radial-gradient(circle at ${x}px ${y}px, #3115cc, #101011)`;
    });

    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
    const togglePassword = document.getElementById('togglePassword');

    function toggleErrorMessage(show) {
        errorMessage.style.display = show ? 'block' : 'none';
    }

    toggleErrorMessage(false);

    if (togglePassword) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassword.classList.toggle('fa-eye-slash');
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault(); 

            const username = usernameInput.value;
            const password = passwordInput.value;

          
            const validUsername = 'user';
            const validPassword = 'password123';

            if (username === validUsername && password === validPassword) {
                window.location.href = 'Formulario.html';
            } else {
                errorMessage.textContent = 'Nome de usuário ou senha incorretos.';
                toggleErrorMessage(true);
            }
        });
    }
});