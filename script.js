document.addEventListener('DOMContentLoaded', () => {

    // 🔵 Animação do background
    document.body.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        document.body.style.background = `radial-gradient(circle at ${x}px ${y}px, #3115cc, #101011)`;
        
        // GABRIEL FEZ AQUI
        //document.body.style.overflow = "hidden";
    });

    // 🔵 Esconder/mostrar header ao scroll
    let lastScroll = 0;
    const header = document.querySelector("header");
    window.addEventListener("scroll", () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if(currentScroll > lastScroll){
            header.style.top = "-100px";
        } else {
            header.style.top = "0";
        }
        lastScroll = currentScroll <= 0 ? 0 : currentScroll;
    });

    // 🔵 Dropdown do usuário
    const userContainer = document.querySelector('.user-container');
    if(userContainer){
        const userDropdown = document.createElement('div');
        userDropdown.classList.add('user-dropdown');
        userDropdown.innerHTML = `
            <ul>
                <li>Visualizar Perfil</li>
                <li>Trocar Foto</li>
                <li>Sair</li>
            </ul>
        `;
        document.body.appendChild(userDropdown);

        userContainer.addEventListener('click', () => {
            userDropdown.classList.toggle('active');
            userContainer.classList.toggle('active');
        });

        document.addEventListener('click', e => {
            if(!userContainer.contains(e.target) && !userDropdown.contains(e.target)){
                userDropdown.classList.remove('active');
                userContainer.classList.remove('active');
            }
        });
    }

    // 🔵 Função para criar modal de processos
    function criarModal(input) {
        const modal = document.createElement('div');
        modal.className = 'modal-processos';
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content-processos';
        const modalTextarea = document.createElement('textarea');
        modalTextarea.className = 'modal-textarea-processos';
        modalTextarea.value = input.value;

        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'modal-buttons';
        const saveBtn = document.createElement('button');
        saveBtn.className = 'btn-salvar-modal';
        saveBtn.textContent = 'Salvar';
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'btn-cancelar-modal';
        cancelBtn.textContent = 'Cancelar';
        buttonsDiv.appendChild(saveBtn);
        buttonsDiv.appendChild(cancelBtn);

        modalContent.appendChild(modalTextarea);
        modalContent.appendChild(buttonsDiv);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        input.addEventListener('focus', () => {
            modal.classList.add('active');
            modalTextarea.focus();
        });

        saveBtn.addEventListener('click', () => {
            input.value = modalTextarea.value;
            modal.classList.remove('active');
        });

        cancelBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        modal.addEventListener('click', (e) => {
            if(e.target === modal) modal.classList.remove('active');
        });

        modalTextarea.addEventListener('input', function(){
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }

    // 🔵 Função para adicionar linhas dinâmicas
    const tabela = document.getElementById('tabelaProcessos').querySelector('tbody');
    const btnAdicionar = document.getElementById('btnAdicionarLinha');
    let contador = 0;
    const limite = 5;

    btnAdicionar.addEventListener('click', () => {
        if(contador >= limite){
            alert(`Você só pode adicionar até ${limite} linhas.`);
            return;
        }

        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td><input type="text" class="processos-input" placeholder="Digite os processos"></td>
            <td><input type="date" class="data-input"></td>
            <td><input type="time" class="hora-input"></td>
            <td><button type="button" class="btn-excluir">Excluir</button></td>
        `;
        tabela.appendChild(linha);
        contador++;

        const processosInput = linha.querySelector('.processos-input');
        criarModal(processosInput);

        linha.querySelector('.btn-excluir').addEventListener('click', () => {
            tabela.removeChild(linha);
            contador--;
        });

        processosInput.addEventListener('input', function(){
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    });
});
