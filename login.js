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
    document.addEventListener('DOMContentLoaded', () => {
    // URL base da sua API. AJUSTE a porta se o seu Back-end estiver rodando em outra!
    const API_BASE_URL = 'https://localhost:5001/api/auth'; 
    const loginForm = document.getElementById('loginForm');
    const errorMessageEl = document.getElementById('error-message');

    // Função para alternar a visibilidade da senha (do seu HTML)
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword) {
        togglePassword.addEventListener('click', function () {
            const passwordInput = document.getElementById('password');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye-slash');
        });
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessageEl.textContent = ''; // Limpa mensagens anteriores

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();

            if (response.ok) {
                // SUCESSO NO LOGIN
                const token = result.token;
                
                // 1. Armazena o Token JWT no armazenamento local do navegador
                localStorage.setItem('jwtToken', token);

                // 2. Redireciona o usuário para a página principal
                window.location.href = 'Clientes.html'; 
            } else {
                // FALHA NO LOGIN (ex: Credenciais inválidas)
                errorMessageEl.textContent = result.message || 'Falha ao fazer login. Verifique suas credenciais.';
            }

        } catch (error) {
            console.error('Erro de rede ou servidor:', error);
            errorMessageEl.textContent = 'Erro ao conectar com o servidor. Tente novamente mais tarde.';
        }
    });
});
});