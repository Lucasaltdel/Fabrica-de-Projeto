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
    document.addEventListener('DOMContentLoaded', () => {
    // URL base da sua API. AJUSTE a porta se o seu Back-end estiver rodando em outra!
    const API_BASE_URL = 'https://localhost:5001/api/auth'; 
    const registerForm = document.getElementById('registerForm');
    
    // Adicione uma área para mensagens no seu Cadastro.html, se ainda não tiver:
    // <p id="register-message" class="success-message"></p>
    const registerMessageEl = document.getElementById('register-message'); 

    // Função para alternar a visibilidade da senha (do seu HTML)
    const togglePasswordVisibility = (toggleId, inputId) => {
        const toggleEl = document.getElementById(toggleId);
        if (toggleEl) {
            toggleEl.addEventListener('click', function () {
                const input = document.getElementById(inputId);
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                this.classList.toggle('fa-eye-slash');
            });
        }
    };
    togglePasswordVisibility('toggleRegPassword', 'reg-password');
    togglePasswordVisibility('toggleRegConfirmPassword', 'reg-confirm-password');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (registerMessageEl) registerMessageEl.textContent = '';
        if (registerMessageEl) registerMessageEl.style.color = 'initial';

        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;

        if (password !== confirmPassword) {
            if (registerMessageEl) {
                registerMessageEl.textContent = 'Erro: As senhas não coincidem!';
                registerMessageEl.style.color = 'red';
                registerMessageEl.style.display = 'block';
            }
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const result = await response.json();

            if (response.ok) {
                // SUCESSO NO CADASTRO
                if (registerMessageEl) {
                    registerMessageEl.textContent = result.message || 'Cadastro realizado com sucesso!';
                    registerMessageEl.style.color = 'green';
                    registerForm.reset(); // Limpa o formulário
                    
                    // Opcional: Redireciona após 2 segundos
                    setTimeout(() => {
                         window.location.href = 'Login.html';
                    }, 2000); 
                }
            } else {
                // FALHA NO CADASTRO (ex: Usuário já existe)
                if (registerMessageEl) {
                    registerMessageEl.textContent = result.message || 'Erro ao cadastrar. Tente outro nome de usuário/email.';
                    registerMessageEl.style.color = 'red';
                }
            }
            if (registerMessageEl) registerMessageEl.style.display = 'block';

        } catch (error) {
            console.error('Erro de rede ou servidor:', error);
            if (registerMessageEl) {
                registerMessageEl.textContent = 'Erro ao conectar com o servidor. Verifique se o backend está rodando.';
                registerMessageEl.style.color = 'red';
                registerMessageEl.style.display = 'block';
            }
        }
    });
});
});