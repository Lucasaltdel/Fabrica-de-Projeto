document.addEventListener('DOMContentLoaded', () => {
    
    document.body.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        document.body.style.background = `radial-gradient(circle at ${x}px ${y}px, #3115cc, #101011)`;
    });

    
    const registerForm = document.getElementById('registerForm');
    const regUsernameInput = document.getElementById('reg-username');
    const regEmailInput = document.getElementById('reg-email');
    const regPasswordInput = document.getElementById('reg-password');
    const regConfirmPasswordInput = document.getElementById('reg-confirm-password');
    const errorMessage = document.getElementById('error-message');
    const toggleRegPassword = document.getElementById('toggleRegPassword');
    const toggleRegConfirmPassword = document.getElementById('toggleRegConfirmPassword');

    
    function toggleErrorMessage(show) {
        errorMessage.style.display = show ? 'block' : 'none';
    }
    toggleErrorMessage(false);


    if (toggleRegPassword) {
        toggleRegPassword.addEventListener('click', () => {
            const type = regPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            regPasswordInput.setAttribute('type', type);
            toggleRegPassword.classList.toggle('fa-eye-slash');
        });
    }

    if (toggleRegConfirmPassword) {
        toggleRegConfirmPassword.addEventListener('click', () => {
            const type = regConfirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            regConfirmPasswordInput.setAttribute('type', type);
            toggleRegConfirmPassword.classList.toggle('fa-eye-slash');
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const username = regUsernameInput.value;
            const email = regEmailInput.value;
            const password = regPasswordInput.value;
            const confirmPassword = regConfirmPasswordInput.value;

            if (password !== confirmPassword) {
                errorMessage.textContent = 'As senhas não coincidem. Tente novamente.';
                toggleErrorMessage(true);
            } else if (password.length < 6) {
                errorMessage.textContent = 'A senha deve ter no mínimo 6 caracteres.';
                toggleErrorMessage(true);
            } else {

                alert('Cadastro realizado com sucesso!');

                window.location.href = 'login.html'; 
            }
        });
    }
});