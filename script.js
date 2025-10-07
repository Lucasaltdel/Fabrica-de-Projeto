document.addEventListener('DOMContentLoaded', () => {

    // 🔵 Animação do background
    document.body.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        document.body.style.background = `radial-gradient(circle at ${x}px ${y}px, #3115cc, #101011)`;
    });

    // 🔵 Esconder/mostrar header ao scroll
    let lastScroll = 0;
    const header = document.querySelector("header");
    window.addEventListener("scroll", () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll > lastScroll) {
            header.style.top = "-100px";
        } else {
            header.style.top = "0";
        }
        lastScroll = currentScroll <= 0 ? 0 : currentScroll;
    });

    // 🔵 Dropdown do usuário
    const userContainer = document.querySelector('.user-container');
    if (userContainer) {
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
            if (!userContainer.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.remove('active');
                userContainer.classList.remove('active');
            }
        });
    }

    // 🔵 --- TABELA DE PROCESSOS (criar-template page) ---
    const tabelaBase = document.getElementById('tabelaProcessos');
    if (tabelaBase) {
        const tabela = tabelaBase.querySelector('tbody');
        const btnAdicionar = document.getElementById('btnAdicionarLinha');
        let contador = 0;
        const limite = 5;

        function criarModalProcessos(input) {
            const modal = document.createElement('div');
            modal.className = 'modal-processos';
            const modalContent = document.createElement('div');
            modalContent.className = 'modal-content-processos';
            const modalTextarea = document.createElement('textarea');
            modalTextarea.className = 'modal-textarea-processos';
            modalTextarea.value = input.value || '';

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
                if (e.target === modal) modal.classList.remove('active');
            });

            modalTextarea.addEventListener('input', function () {
                this.style.height = 'auto';
                this.style.height = this.scrollHeight + 'px';
            });
        }

        btnAdicionar.addEventListener('click', () => {
            if (contador >= limite) {
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
            criarModalProcessos(processosInput);

            linha.querySelector('.btn-excluir').addEventListener('click', () => {
                tabela.removeChild(linha);
                contador--;
            });

            processosInput.addEventListener('input', function () {
                this.style.height = 'auto';
                this.style.height = this.scrollHeight + 'px';
            });
        });
    }

    // 🔵 --- PROPOSTAS: criar / editar / visualizar / excluir / filtros / exportar PDF ---
    const filtroCliente = document.getElementById('filtroCliente');
    const filtroTemplate = document.getElementById('filtroTemplate');
    const filtroStatus = document.getElementById('filtroStatus');
    const tabelaPropostas = document.getElementById('propostasTable');
    const btnCriarProposta = document.getElementById('btnCriarProposta');
    const btnExportar = document.getElementById('btnExportarPDF');

    let proposals = [];
    let proposalIdCounter = 1;

    function preencherSelectComValoresUnicos(selectEl, values) {
        if (!selectEl) return;
        const first = selectEl.querySelector('option');
        selectEl.innerHTML = '';
        if (first) selectEl.appendChild(first.cloneNode(true));
        const unique = Array.from(new Set(values)).filter(v => v && v !== '');
        unique.forEach(v => {
            const o = document.createElement('option');
            o.value = v;
            o.textContent = v;
            selectEl.appendChild(o);
        });
    }

    function atualizarFiltrosGlobais() {
        const clientes = proposals.map(p => p.cliente);
        const templates = proposals.map(p => p.template);
        preencherSelectComValoresUnicos(filtroCliente, clientes);
        preencherSelectComValoresUnicos(filtroTemplate, templates);
    }

    function aplicarFiltros() {
        if (!tabelaPropostas) return;
        const tbody = tabelaPropostas.querySelector('tbody');
        const rows = Array.from(tbody.rows);
        const cliente = filtroCliente ? filtroCliente.value : '';
        const template = filtroTemplate ? filtroTemplate.value : '';
        const status = filtroStatus ? filtroStatus.value : '';

        rows.forEach(r => {
            const cols = r.getElementsByTagName('td');
            const matchCliente = cliente === '' || cols[0].textContent === cliente;
            const matchTemplate = template === '' || cols[1].textContent === template;
            const matchStatus = status === '' || cols[3].textContent === status;
            r.style.display = (matchCliente && matchTemplate && matchStatus) ? '' : 'none';
        });
    }

    function criarLinhaTabela(proposal) {
        if (!tabelaPropostas) return;
        const tbody = tabelaPropostas.querySelector('tbody');
        const tr = document.createElement('tr');
        tr.dataset.id = proposal.id;
        tr.innerHTML = `
            <td>${proposal.cliente}</td>
            <td>${proposal.template}</td>
            <td>${proposal.data}</td>
            <td>${proposal.status}</td>
            <td>
                <button class="btn-visualizar">Visualizar</button>
                <button class="btn-editar">Editar</button>
                <button class="btn-excluir">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);

        tr.querySelector('.btn-visualizar').addEventListener('click', () => visualizarProposal(proposal.id));
        tr.querySelector('.btn-editar').addEventListener('click', () => editarProposal(proposal.id));
        tr.querySelector('.btn-excluir').addEventListener('click', () => excluirProposal(proposal.id));
    }

    function refreshTabela() {
        if (!tabelaPropostas) return;
        const tbody = tabelaPropostas.querySelector('tbody');
        tbody.innerHTML = '';
        proposals.forEach(p => criarLinhaTabela(p));
        atualizarFiltrosGlobais();
        aplicarFiltros();
    }

    function visualizarProposal(id) {
        const p = proposals.find(x => x.id === id);
        if (!p) return;
        abrirModalCriarEditar({ ...p, readonly: true });
    }

    function editarProposal(id) {
        const p = proposals.find(x => x.id === id);
        if (!p) return;
        abrirModalCriarEditar({ ...p, readonly: false, editingId: id });
    }

    function excluirProposal(id) {
        if (!confirm('Deseja remover esta proposta?')) return;
        proposals = proposals.filter(x => x.id !== id);
        refreshTabela();
    }

    function abrirModalCriarEditar(options = {}) {
        const modal = document.createElement('div');
        modal.className = 'modal-processos';
        const content = document.createElement('div');
        content.className = 'modal-content-processos';

        const title = document.createElement('h3');
        title.style.margin = '0';
        title.style.color = '#3115cc';
        title.textContent = options.editingId ? 'Editar Proposta' : (options.readonly ? 'Visualizar Proposta' : 'Criar Proposta');

        const clienteInput = document.createElement('input');
        clienteInput.placeholder = 'Cliente';
        clienteInput.value = options.cliente || '';

        const emailInput = document.createElement('input');
        emailInput.type = 'email';
        emailInput.placeholder = 'E-mail do Cliente';
        emailInput.value = options.email || '';

        const templateInput = document.createElement('input');
        templateInput.placeholder = 'Template';
        templateInput.value = options.template || '';

        const dataInput = document.createElement('input');
        dataInput.type = 'date';
        dataInput.value = options.data || new Date().toISOString().slice(0, 10);

        const statusSelect = document.createElement('select');
        ['Pendente', 'Aprovada', 'Rejeitada'].forEach(s => {
            const o = document.createElement('option');
            o.value = s;
            o.textContent = s;
            statusSelect.appendChild(o);
        });
        statusSelect.value = options.status || 'Pendente';

        const mensagem = document.createElement('textarea');
        mensagem.placeholder = 'Mensagem de aprovação/negação (opcional)';
        mensagem.value = options.mensagem || '';

        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'modal-buttons';

        const salvarBtn = document.createElement('button');
        salvarBtn.className = 'btn-salvar-modal';
        salvarBtn.textContent = options.readonly ? 'Fechar' : 'Salvar';

        const exportBtn = document.createElement('button');
        exportBtn.className = 'btn-criar';
        exportBtn.textContent = 'Exportar PDF';

        const cancelarBtn = document.createElement('button');
        cancelarBtn.className = 'btn-cancelar-modal';
        cancelarBtn.textContent = 'Cancelar';

        buttonsDiv.appendChild(exportBtn);
        if (!options.readonly) buttonsDiv.appendChild(salvarBtn);
        buttonsDiv.appendChild(cancelarBtn);

        content.appendChild(title);
        content.appendChild(clienteInput);
        content.appendChild(emailInput);
        content.appendChild(templateInput);
        content.appendChild(dataInput);
        content.appendChild(statusSelect);
        content.appendChild(mensagem);
        content.appendChild(buttonsDiv);
        modal.appendChild(content);
        document.body.appendChild(modal);

        function closeModal() {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 250);
        }

        if (options.readonly) {
            clienteInput.readOnly = true;
            emailInput.readOnly = true;
            templateInput.readOnly = true;
            dataInput.readOnly = true;
            statusSelect.disabled = true;
            mensagem.readOnly = true;
        }

        setTimeout(() => modal.classList.add('active'), 10);

        cancelarBtn.addEventListener('click', closeModal);

        salvarBtn && salvarBtn.addEventListener('click', () => {
            const cliente = clienteInput.value.trim();
            const email = emailInput.value.trim();
            const template = templateInput.value.trim();
            const data = dataInput.value;
            const status = statusSelect.value;
            const msg = mensagem.value.trim();

            if (!cliente || !template || !email) {
                alert('Preencha Cliente, E-mail e Template.');
                return;
            }

            if (options.editingId) {
                const idx = proposals.findIndex(x => x.id === options.editingId);
                if (idx !== -1) {
                    proposals[idx] = { id: options.editingId, cliente, email, template, data, status, mensagem: msg };
                }
            } else {
                proposals.push({ id: proposalIdCounter++, cliente, email, template, data, status, mensagem: msg });
            }
            refreshTabela();
            closeModal();
        });

        exportBtn.addEventListener('click', () => {
            const cliente = clienteInput.value.trim();
            const email = emailInput.value.trim();
            const template = templateInput.value.trim();
            const data = dataInput.value;
            const status = statusSelect.value;
            const msg = mensagem.value.trim();

            if (!cliente || !template || !email) {
                alert('Preencha Cliente, E-mail e Template para exportar.');
                return;
            }

            generatePDFFromProposals([{ cliente, email, template, data, status, mensagem: msg }], `Proposta - ${cliente}`);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    function gatherVisibleProposalsFromTable() {
        if (!tabelaPropostas) return [];
        const tbody = tabelaPropostas.querySelector('tbody');
        const rows = Array.from(tbody.rows).filter(r => r.style.display !== 'none');
        return rows.map(r => {
            const cols = r.getElementsByTagName('td');
            const prop = proposals.find(p => p.cliente === cols[0].textContent && p.template === cols[1].textContent);
            return prop || {};
        });
    }

    function generatePDFFromProposals(proposalsToExport, title) {
        const jsPDFCtor = window.jspdf?.jsPDF || window.jsPDF;
        if (!jsPDFCtor) {
            alert('Para exportar PDF, inclua jsPDF (CDN) antes do seu script.');
            return;
        }

        const doc = new jsPDFCtor();
        doc.setFontSize(16);
        doc.text(title || 'Relatório de Propostas', 14, 20);
        doc.setFontSize(10);
        doc.text(`Emitido em: ${new Date().toLocaleString()}`, 14, 28);
        let y = 36;
        const margin = 14;
        const maxLineWidth = doc.internal.pageSize.getWidth() - margin * 2;

        proposalsToExport.forEach((p, idx) => {
            doc.setFontSize(12);
            doc.text(`${idx + 1}. Cliente: ${p.cliente}`, margin, y);
            y += 6;
            doc.text(`E-mail: ${p.email}`, margin, y);
            y += 6;
            doc.text(`Template: ${p.template}    Data: ${p.data}    Status: ${p.status}`, margin, y);
            y += 6;
            if (p.mensagem) {
                const lines = doc.splitTextToSize(`Mensagem: ${p.mensagem}`, maxLineWidth);
                doc.text(lines, margin, y);
                y += lines.length * 6;
            }
            y += 8;
            if (y > doc.internal.pageSize.getHeight() - 30) {
                doc.addPage();
                y = 20;
            }
        });

        doc.save('relatorio-propostas.pdf');
    }

    if (filtroCliente) filtroCliente.addEventListener('change', aplicarFiltros);
    if (filtroTemplate) filtroTemplate.addEventListener('change', aplicarFiltros);
    if (filtroStatus) filtroStatus.addEventListener('change', aplicarFiltros);

    if (btnCriarProposta) {
        btnCriarProposta.addEventListener('click', () => abrirModalCriarEditar());
    }

    if (btnExportar) {
        btnExportar.addEventListener('click', () => {
            const visible = gatherVisibleProposalsFromTable();
            if (!visible.length) {
                alert('Não há propostas visíveis para exportar.');
                return;
            }
            generatePDFFromProposals(visible, 'Relatório de Propostas');
        });
    }

    refreshTabela();
});
