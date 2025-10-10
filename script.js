// Verifica o contexto da página
const isPropostasPage = !!document.getElementById('propostasTable');
const isAnalisePage = !!document.getElementById('tabelaAnalise');
const isClientesPage = !!document.getElementById('clientesTableBody');

document.addEventListener('DOMContentLoaded', () => {

    // ---------------------------------------------------
    // 🔵 VARIÁVEIS DE ELEMENTOS COMUNS E INICIAIS
    // ---------------------------------------------------
    const header = document.querySelector("header");
    
    // Variáveis Comuns a Propostas/Análise
    const tabelaPrincipal = document.getElementById('propostasTable') || document.getElementById('tabelaAnalise');
    const filtroCliente = document.getElementById('filtroCliente');
    const filtroTemplate = document.getElementById('filtroTemplate');
    const filtroStatus = document.getElementById('filtroStatus');
    const btnExportarExcel = document.getElementById('exportarExcel');
    const btnCriarProposta = document.getElementById('btnCriarProposta'); 
    
    // Variáveis do Modal (Propostas)
    const modalOverlay = document.getElementById('proposalModalOverlay');
    const proposalForm = document.getElementById('proposalForm');
    
    // Simulação de dados (APENAS PARA PROPOSTAS/ANÁLISE, POIS NÃO SÃO PAGINADAS POR API)
    let proposals = [];
    let proposalIdCounter = 1;


    // ---------------------------------------------------
    // 🔵 FUNÇÕES DE INTERFACE E UTILIDADE (Comuns)
    // ---------------------------------------------------

    // Animação do background e Header
    document.body.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        document.body.style.background = `radial-gradient(circle at ${x}px ${y}px, #3115cc, #101011)`;
    });

    let lastScroll = 0;
    if (header) {
        window.addEventListener("scroll", () => {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            header.style.top = currentScroll > lastScroll ? "-100px" : "0";
            lastScroll = currentScroll <= 0 ? 0 : currentScroll;
        });
    }

    // Funções de Modal e PDF (PROPOSTAS) - (Omitidas por brevidade, mas devem estar completas aqui)
    function showModal() { /* ... */ }
    function hideModal() { /* ... */ }
    function coletarDadosDoModal() { /* ... */ return {}; }
    function gerarPdfPropostaIndividual(data) { /* ... */ }

    // ---------------------------------------------------
    // 🟢 LÓGICA DA PÁGINA: PROPOSTAS E ANÁLISE
    // ---------------------------------------------------
    if (isPropostasPage || isAnalisePage) {
        
        // ... (Corpo da lógica de Propostas e Análise, incluindo funções como atualizarFiltros, aplicarFiltros, refreshTabela, etc.)
        
        // INICIALIZAÇÃO
        if (tabelaPrincipal) {
            // ... (Inicialização e listeners de Propostas/Análise)
        }
    }


    // ---------------------------------------------------
    // 🟦 LÓGICA DA PÁGINA: CLIENTES (Paginação de 6 em 6)
    // ---------------------------------------------------
    if (isClientesPage) {
        
        // VARIÁVEIS DE CLIENTES
        const CLIENTS_API_BASE = '/api/clients'; 
        const pageSize = 6; // *** TAMANHO DE PÁGINA FIXO: 6 USUÁRIOS ***

        let currentPage = 1;
        let totalPages = 1;

        const tableBody = document.getElementById('clientesTableBody');
        const paginationControls = document.querySelector('.pagination-controls');
        const prevButton = document.getElementById('prevPage');
        const nextPage = document.getElementById('nextPage');
        const paginationContainer = document.getElementById('paginationContainer');
        
        // SELECTORES DE FILTRO INDIVIDUAIS
        const filtroNome = document.getElementById('filtroNome');
        const filtroEmail = document.getElementById('filtroEmail');
        const filtroTelefone = document.getElementById('filtroTelefone');
        const filtroPlano = document.getElementById('filtroPlano');
        const filtroTipoTemplate = document.getElementById('filtroTipoTemplate');


        // --- FUNÇÃO DE BUSCA DE DADOS (CONEXÃO REAL COM O BACK-END) ---
        async function fetchClients(page, filters) {
            
            const params = new URLSearchParams();
            params.append('page', page);
            params.append('size', pageSize);

            if (filters.nome) params.append('name', filters.nome); 
            if (filters.email) params.append('email', filters.email); 
            if (filters.telefone) params.append('phone', filters.telefone); 
            if (filters.plano) params.append('plano', filters.plano);
            if (filters.tipoTemplate) params.append('templateType', filters.tipoTemplate);
            
            const url = `${CLIENTS_API_BASE}?${params.toString()}`;
            console.log(`Buscando clientes da API: ${url}`);
            
            try {
                // ESTE É O PONTO DE CONEXÃO COM SUA API:
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Erro de rede: ${response.status}`);
                }
                const data = await response.json();
                
                // O objeto 'data' DEVE ter: { clients: [...], totalPages: N, currentPage: P }
                return {
                    clients: data.clients || [],
                    totalPages: data.totalPages || 1, // Garante que a páginação nunca seja < 1
                    currentPage: data.currentPage || page
                };
                
            } catch (error) {
                console.error("Erro ao buscar clientes:", error);
                return { clients: [], totalPages: 1, currentPage: 1 };
            }
        }
        
        // --- FUNÇÕES DE RENDERIZAÇÃO E CONTROLE ---
        function renderTable(clients) {
            if (!tableBody) return;
            tableBody.innerHTML = '';
            
            if (!clients || clients.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Nenhum cliente ou proposta encontrada.</td></tr>';
                return;
            }

            clients.forEach(client => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${client.nome}</td>
                    <td>${client.email}</td>
                    <td>${client.telefone}</td>
                    <td>${client.plano || '-'}</td>
                    <td>${client.template || '-'}</td>
                    <td>${client.status || 'N/A'}</td>
                `;
                tableBody.appendChild(row);
            });
        }

        function renderPagination() {
            if (!paginationContainer) return;
            paginationContainer.innerHTML = '';
            
            if (totalPages > 1) {
                // Indicador de Página Atual / Total (para aparecer ao lado dos botões)
                const pageIndicator = document.createElement('span');
                pageIndicator.textContent = `Página ${currentPage} de ${totalPages}`;
                pageIndicator.style.margin = '0 10px';
                pageIndicator.style.fontWeight = 'bold';
                paginationContainer.appendChild(pageIndicator); // Adicionado ao container

                // Lógica de numeração de páginas
                const startPage = Math.max(1, currentPage - 2);
                const endPage = Math.min(totalPages, currentPage + 2);

                for (let i = startPage; i <= endPage; i++) {
                    const pageButton = document.createElement('span');
                    pageButton.classList.add('page-number');
                    if (i === currentPage) pageButton.classList.add('active');
                    pageButton.textContent = i;
                    pageButton.dataset.page = i;
                    paginationContainer.appendChild(pageButton);

                    pageButton.addEventListener('click', (e) => {
                        const newPage = parseInt(e.target.dataset.page);
                        if (newPage !== currentPage) loadClients(newPage);
                    });
                }
            }
        }

        function updateControls() {
            if (!paginationControls || !prevButton || !nextPage) return;

            // *** REQUISITO ATENDIDO: Oculta a paginação se o total de páginas for 1 ou menos. ***
            if (totalPages > 1) {
                paginationControls.style.display = 'flex';
                
                // Habilita/Desabilita Anterior/Próxima
                prevButton.disabled = currentPage === 1;
                nextPage.disabled = currentPage === totalPages;
            } else {
                paginationControls.style.display = 'none';
            }
        }
        
        async function loadClients(page = 1) {
            // Desabilita e oculta tudo durante o carregamento
            if (tableBody) tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Carregando dados...</td></tr>';
            if (paginationControls) paginationControls.style.display = 'none'; 

            const currentFilters = {
                nome: filtroNome ? filtroNome.value.trim() : '',
                email: filtroEmail ? filtroEmail.value.trim() : '',
                telefone: filtroTelefone ? filtroTelefone.value.trim() : '',
                plano: filtroPlano ? filtroPlano.value : '',
                tipoTemplate: filtroTipoTemplate ? filtroTipoTemplate.value : ''
            };

            const data = await fetchClients(page, currentFilters);
            
            // Atribui os valores reais
            currentPage = data.currentPage;
            totalPages = data.totalPages; 

            renderTable(data.clients);
            renderPagination();
            updateControls();
        }
        
        // --- LISTENERS DE NAVEGAÇÃO E FILTRO ---
        const reloadOnFilterChange = () => loadClients(1);

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                if (currentPage > 1) loadClients(currentPage - 1);
            });
        }

        if (nextPage) {
            nextPage.addEventListener('click', () => {
                if (currentPage < totalPages) loadClients(currentPage + 1);
            });
        }
        
        // Listeners de filtro
        if (filtroNome) filtroNome.addEventListener('input', reloadOnFilterChange);
        if (filtroEmail) filtroEmail.addEventListener('input', reloadOnFilterChange);
        if (filtroTelefone) filtroTelefone.addEventListener('input', reloadOnFilterChange);
        if (filtroPlano) filtroPlano.addEventListener('change', reloadOnFilterChange);
        if (filtroTipoTemplate) filtroTipoTemplate.addEventListener('change', reloadOnFilterChange);

        // Início da carga da página Clientes
        loadClients(1);
    }
});