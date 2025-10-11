// Verifica o contexto da página
const isPropostasPage = !!document.getElementById('propostasTable');
const isAnalisePage = !!document.getElementById('tabelaAnalise'); 

document.addEventListener('DOMContentLoaded', () => {

    // ---------------------------------------------------
    // 🔵 VARIÁVEIS DE ELEMENTOS
    // ---------------------------------------------------
    const filtroCliente = document.getElementById('filtroCliente');
    const filtroTemplate = document.getElementById('filtroTemplate');
    const filtroStatus = document.getElementById('filtroStatus');
    const tabelaPrincipal = document.getElementById('propostasTable') || document.getElementById('tabelaAnalise');
    
    // O botão btnExportarPDF não terá mais função ativa, mas o ID é mantido.
    const btnExportarPDF = document.getElementById('btnExportarPDF'); 
    const btnExportarExcel = document.getElementById('exportarExcel');
    const btnCriarProposta = document.getElementById('btnCriarProposta'); 
    
    // Variáveis do Modal
    const modalOverlay = document.getElementById('proposalModalOverlay');
    const proposalForm = document.getElementById('proposalForm');
    
    let proposals = [];
    let proposalIdCounter = 1;


    // ---------------------------------------------------
    // 🔵 FUNÇÕES DE INTERFACE E UTILIDADE
    // ---------------------------------------------------

    // Animação do background e Header (Mantido)
    document.body.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        document.body.style.background = `radial-gradient(circle at ${x}px ${y}px, #3115cc, #101011)`;
    });

    let lastScroll = 0;
    const header = document.querySelector("header");
    window.addEventListener("scroll", () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        header.style.top = currentScroll > lastScroll ? "-100px" : "0";
        lastScroll = currentScroll <= 0 ? 0 : currentScroll;
    });

// -----------------------------
// 🔵 ADICIONAR LINHA (templates) + CRIAR TEMPLATE (limite persistente)
// Cole este bloco ANTES do fechamento do `document.addEventListener('DOMContentLoaded', ... );`
// -----------------------------
(function() {

    // =========================================================
    // 🟩 ADICIONAR LINHA NA TABELA DE PROCESSOS (limite de 5)
    // =========================================================
    const btnAdicionarLinha = document.getElementById('btnAdicionarLinha');
    const tabelaProcessosEl = document.getElementById('tabelaProcessos');
    const tbodyProcessos = tabelaProcessosEl ? tabelaProcessosEl.querySelector('tbody') : null;
    const MAX_LINHAS = 5;

    if (btnAdicionarLinha && tbodyProcessos) {
        btnAdicionarLinha.addEventListener('click', (e) => {
            e.preventDefault();

            const linhasAtuais = tbodyProcessos.querySelectorAll('tr').length;
            if (linhasAtuais >= MAX_LINHAS) {
                alert(`⚠️ Você atingiu o limite máximo de ${MAX_LINHAS} linhas.`);
                return;
            }

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><input type="text" name="processo[]" placeholder="Digite o processo" required></td>
                <td><input type="date" name="data[]" required></td>
                <td><input type="time" name="hora[]" required></td>
                <td><button type="button" class="btn-remover">Remover</button></td>
            `;
            tbodyProcessos.appendChild(tr);
        });

        // Remover linha (delegação)
        tbodyProcessos.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-remover')) {
                const linha = e.target.closest('tr');
                if (linha) linha.remove();
            }
        });

    } else {
        console.log('⚠️ [Adicionar Linha] Elementos não encontrados (#btnAdicionarLinha ou #tabelaProcessos).');
    }

    // =========================================================
    // 🟦 CRIAR TEMPLATE COM LIMITE DE 5 (persistente via localStorage)
    // =========================================================
    const btnCriarTemplate = document.getElementById('btnCriarTemplate');
    const STORAGE_KEY = 'templatesCriados_v1';
    const MAX_TEMPLATES = 5;

    function getTemplatesCount() {
        return parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
    }

    function setTemplatesCount(n) {
        localStorage.setItem(STORAGE_KEY, String(n));
    }

    if (btnCriarTemplate) {
        btnCriarTemplate.addEventListener('click', (e) => {
            e.preventDefault();

            let count = getTemplatesCount();
            if (count >= MAX_TEMPLATES) {
                alert(`⚠️ Limite máximo de ${MAX_TEMPLATES} templates atingido.`);
                return;
            }

            count++;
            setTemplatesCount(count);

            // Redireciona para a página de criação
            const href = btnCriarTemplate.getAttribute('data-href') || btnCriarTemplate.getAttribute('href');
            window.location.href = href || 'criar-template.html';
        });
    }

    // =========================================================
    // 🟨 CONTADOR VISUAL (opcional)
    // =========================================================
    const contadorEl = document.getElementById('templatesContador');
    if (contadorEl) {
        function atualizarContadorUI() {
            const c = getTemplatesCount();
            contadorEl.textContent = `${c}/${MAX_TEMPLATES} templates criados`;
        }
        atualizarContadorUI();
        window.addEventListener('storage', atualizarContadorUI);
    }

})();


    // Função show/hide Modal - USANDO A CLASSE 'active' DO SEU CSS
    function showModal() {
        const dateInput = document.getElementById('modal-data');
        if (dateInput) {
            dateInput.value = new Date().toISOString().substring(0, 10);
        }
        if (modalOverlay) modalOverlay.classList.add('active');
    }

    function hideModal() {
        if (modalOverlay) modalOverlay.classList.remove('active');
        if (proposalForm) proposalForm.reset();
    }

    // Coleta dados do formulário do modal
    function coletarDadosDoModal() {
        return {
            id: proposalIdCounter++,
            cliente: document.getElementById('modal-nome').value,
            email: document.getElementById('modal-email').value,
            data: document.getElementById('modal-data').value,
            status: document.getElementById('modal-status').value,
            mensagem: document.getElementById('modal-mensagem').value,
            responsavel: 'Equipe Atual', 
            valor: 'R$ 0,00', 
            template: 'N/A' 
        };
    }
    
    // Funções de Tabela e Filtros (Mantidas)
    function atualizarFiltros() {
        if (!filtroCliente || !filtroTemplate) return;
        const clientes = Array.from(new Set(proposals.map(p => p.cliente))).sort();
        const templates = Array.from(new Set(proposals.map(p => p.template))).sort();

        filtroCliente.innerHTML = '<option value="">Todos os Clientes</option>';
        clientes.forEach(c => filtroCliente.innerHTML += `<option value="${c}">${c}</option>`);

        filtroTemplate.innerHTML = '<option value="">Todos os Templates</option>';
        templates.forEach(t => filtroTemplate.innerHTML += `<option value="${t}">${t}</option>`);
    }

    function aplicarFiltros() {
        if (!tabelaPrincipal) return;
        const tbody = tabelaPrincipal.querySelector('tbody');
        const cliente = filtroCliente ? filtroCliente.value : '';
        const status = filtroStatus ? filtroStatus.value : '';

        const statusColIndex = isPropostasPage ? 3 : 2; 
        
        Array.from(tbody.rows).forEach(row => {
            const cols = row.getElementsByTagName('td');
            const matchCliente = cliente === '' || cols[0].textContent === cliente;
            const matchStatus = status === '' || cols[statusColIndex].textContent === status;

            row.style.display = (matchCliente && matchStatus) ? '' : 'none';
        });
    }

    function criarLinhaTabela(proposal) {
        if (!tabelaPrincipal) return;
        const tbody = tabelaPrincipal.querySelector('tbody');
        const tr = document.createElement('tr');
        tr.dataset.id = proposal.id;
        
        if (isPropostasPage) {
            tr.innerHTML = `
                <td>${proposal.cliente}</td>
                <td>${proposal.template || '-'}</td>
                <td>${proposal.data}</td>
                <td>${proposal.status}</td>
                <td><button class="btn-detalhes" data-id="${proposal.id}">Baixar pdf</button></td>
            `;
        } else if (isAnalisePage) {
             tr.innerHTML = `
                <td>${proposal.cliente}</td>
                <td>${proposal.data}</td>
                <td>${proposal.status}</td>
                <td>${proposal.valor || 'R$ 0,00'}</td>
                <td>${proposal.responsavel || '-'}</td>
            `;
        }
        tbody.appendChild(tr);
    }

    function refreshTabela() {
        if (!tabelaPrincipal) return;
        const tbody = tabelaPrincipal.querySelector('tbody');
        tbody.innerHTML = '';
        proposals.forEach(p => criarLinhaTabela(p));
        atualizarFiltros();
        aplicarFiltros();

        // Adiciona o listener para os botões 'Detalhes' após a tabela ser recriada
        if (isPropostasPage) {
            document.querySelectorAll('.btn-detalhes').forEach(button => {
                button.addEventListener('click', (e) => {
                    const proposalId = parseInt(e.target.dataset.id);
                    const proposal = proposals.find(p => p.id === proposalId);
                    if (proposal) {
                        gerarPdfPropostaIndividual(proposal);
                    } else {
                        alert('Dados da proposta não encontrados.');
                    }
                });
            });
        }
    }
    
    // Função de geração de PDF a partir de QUALQUER objeto de dados de proposta
    function gerarPdfPropostaIndividual(data) {
        if (typeof window.jspdf === 'undefined') {
            alert('A biblioteca jsPDF não está carregada. Verifique a tag <script> no HTML.');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.text("Proposta de Cliente", 10, 10);
        doc.setFontSize(12);
        
        let y = 20;
        doc.text(`Cliente: ${data.cliente}`, 10, y); y += 7;
        doc.text(`E-mail: ${data.email || 'N/A'}`, 10, y); y += 7;
        doc.text(`Data da Proposta: ${data.data}`, 10, y); y += 7;
        doc.text(`Status de Validação: ${data.status}`, 10, y); y += 10;
        doc.text(`Mensagem da Equipe:`, 10, y); y += 5;
        
        // Quebra de linha para mensagem longa
        const splitText = doc.splitTextToSize(data.mensagem || 'N/A', 180);
        doc.text(splitText, 10, y);
        
        doc.save(`proposta_${data.cliente.replace(/\s/g, '_')}_${data.data}.pdf`);
    }

    // ---------------------------------------------------
    // 🔵 EVENTOS E LISTENERS
    // ---------------------------------------------------

    // 1. ABRIR MODAL: Botão "Criar / Exportar Proposta"
    if (btnCriarProposta) {
        btnCriarProposta.addEventListener('click', (e) => {
            e.preventDefault(); 
            showModal();
        });
    }

    // 2. AÇÕES DO MODAL
    
    // Botão "Exportar Direto (PDF)"
    document.addEventListener('click', (e) => {
        if (e.target.id === 'btnExportarDireto') {
            e.preventDefault();
            
            if (!proposalForm.checkValidity()) {
                proposalForm.reportValidity();
                return;
            }
            
            const newProposalData = coletarDadosDoModal();
            gerarPdfPropostaIndividual(newProposalData); // Reutilizando a função
            hideModal();
        }
    });
    
    // Botão "Salvar Proposta" (Submissão do formulário)
    if (proposalForm) {
        proposalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newProposalData = coletarDadosDoModal();
            
            console.log("Enviando dados para o back-end:", newProposalData);
            alert(`Proposta de ${newProposalData.cliente} salva com sucesso! (Simulação)`);

            proposals.push(newProposalData);
            refreshTabela();
            
            hideModal();
        });
    }
    
    // Botão "Cancelar" e clique no fundo do modal
    document.addEventListener('click', (e) => {
        if (e.target.id === 'btnCancelarModal' || e.target.id === 'proposalModalOverlay') {
            e.preventDefault();
            hideModal();
        }
    });

    // 3. REMOVIDO: EXPORTAR PDF (Visíveis da Tabela)
    // O botão btnExportarPDF agora não tem ação no JS.

    // 4. EXPORTAR CSV (Análise) - Lógica da página Análise (Mantida)
    if (isAnalisePage && btnExportarExcel) {
        btnExportarExcel.addEventListener('click', () => {
            // ... (Lógica de exportação CSV aqui)
            if (!tabelaPrincipal) return;
            const SEPARADOR = ';';
            const headers = ['Cliente','Data','Status','Valor','Responsável','Template']; 
            
            const rows = proposals.filter(p => {
                const cliente = filtroCliente ? filtroCliente.value : '';
                const status = filtroStatus ? filtroStatus.value : '';
                const matchCliente = cliente === '' || p.cliente === cliente;
                const matchStatus = status === '' || p.status === status;
                return matchCliente && matchStatus;
            });

            const BOM = '\uFEFF'; 
            const csvData = [headers.join(SEPARADOR)];
            
            rows.forEach(proposal => {
                const cols = [
                    proposal.cliente, proposal.data, proposal.status, 
                    proposal.valor || 'R$ 0,00', proposal.responsavel || '-', 
                    proposal.template || '-'
                ].map(text => `"${String(text).trim().replace(/"/g, '""')}"`);
                csvData.push(cols.join(SEPARADOR));
            });

            const csv = BOM + csvData.join('\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'analise.csv';
            a.click();
            a.remove();
            alert('Dados da Análise exportados para CSV (Excel).');
        });
    }


    // ---------------------------------------------------
    // 🔵 INICIALIZAÇÃO
    // ---------------------------------------------------
    if (tabelaPrincipal) {
        refreshTabela();
    }
    
    // Eventos filtros
    if (filtroCliente) filtroCliente.addEventListener('change', aplicarFiltros);
    if (filtroTemplate) filtroTemplate.addEventListener('change', aplicarFiltros);
    if (filtroStatus) filtroStatus.addEventListener('change', aplicarFiltros);


    // ======================================================
// 🟦 CLIENTES PAGE - Lista, Filtros e Paginação
// ======================================================
document.addEventListener('DOMContentLoaded', () => {
  const isClientesPage = !!document.getElementById('clientesTable');
  if (!isClientesPage) return;

  // Simulação do array (vem do back-end no futuro)
  // Deixe vazio, o back-end vai preencher via fetch:
  let clientes = []; // ← o backend envia algo como [{nome, status, templates, pdfGerado}, ...]

  // Variáveis de UI
  const tabela = document.getElementById('clientesTable').querySelector('tbody');
  const filtroNome = document.getElementById('filtroNome');
  const filtroStatus = document.getElementById('filtroStatus');
  const filtroTemplates = document.getElementById('filtroTemplates');
  const filtroPDF = document.getElementById('filtroPDF');
  const btnAnterior = document.getElementById('btnAnterior');
  const btnProximo = document.getElementById('btnProximo');
  const paginaAtualEl = document.getElementById('paginaAtual');

  // Paginação
  const ITENS_POR_PAGINA = 10;
  let paginaAtual = 1;

  // 🔹 Carregar clientes do back-end (exemplo de fetch)
  async function carregarClientes() {
    try {
      const resposta = await fetch('/api/clientes'); // endpoint do seu back-end
      clientes = await resposta.json();
      renderizarTabela();
    } catch (err) {
      console.error('Erro ao buscar clientes:', err);
      tabela.innerHTML = '<tr><td colspan="4">Erro ao carregar clientes.</td></tr>';
    }
  }

  // 🔹 Aplicar filtros
  function filtrarClientes() {
    return clientes.filter(c => {
      const nomeFiltro = filtroNome.value.trim().toLowerCase();
      const statusFiltro = filtroStatus.value;
      const templateFiltro = filtroTemplates.value;
      const pdfFiltro = filtroPDF.value;

      let condNome = !nomeFiltro || c.nome.toLowerCase().includes(nomeFiltro);
      let condStatus = !statusFiltro || c.status === statusFiltro;

      let condTemplates = true;
      if (templateFiltro === '0') condTemplates = c.templates === 0;
      else if (templateFiltro === '1-3') condTemplates = c.templates >= 1 && c.templates <= 3;
      else if (templateFiltro === '4+') condTemplates = c.templates >= 4;

      let condPDF = !pdfFiltro || (pdfFiltro === 'Sim' ? c.pdfGerado : !c.pdfGerado);

      return condNome && condStatus && condTemplates && condPDF;
    });
  }

  // 🔹 Renderizar tabela conforme página atual
  function renderizarTabela() {
    const filtrados = filtrarClientes();
    const totalPaginas = Math.ceil(filtrados.length / ITENS_POR_PAGINA);
    paginaAtual = Math.min(paginaAtual, totalPaginas || 1);

    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
    const pagina = filtrados.slice(inicio, inicio + ITENS_POR_PAGINA);

    tabela.innerHTML = '';

    if (pagina.length === 0) {
      tabela.innerHTML = '<tr><td colspan="4">Nenhum cliente encontrado.</td></tr>';
    } else {
      pagina.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${c.nome}</td>
          <td>${c.status}</td>
          <td>${c.templates}</td>
          <td>${c.pdfGerado ? 'Sim' : 'Não'}</td>
        `;
        tabela.appendChild(tr);
      });
    }

    paginaAtualEl.textContent = `${paginaAtual} / ${totalPaginas || 1}`;
    btnAnterior.disabled = paginaAtual === 1;
    btnProximo.disabled = paginaAtual >= totalPaginas;
  }

  // 🔹 Paginação
  btnAnterior.addEventListener('click', () => {
    if (paginaAtual > 1) {
      paginaAtual--;
      renderizarTabela();
    }
  });
  btnProximo.addEventListener('click', () => {
    const filtrados = filtrarClientes();
    const totalPaginas = Math.ceil(filtrados.length / ITENS_POR_PAGINA);
    if (paginaAtual < totalPaginas) {
      paginaAtual++;
      renderizarTabela();
    }
  });

  // 🔹 Filtros
  [filtroNome, filtroStatus, filtroTemplates, filtroPDF].forEach(el => {
    el.addEventListener('input', () => {
      paginaAtual = 1;
      renderizarTabela();
    });
  });

  // Inicializa
  carregarClientes();
});

});