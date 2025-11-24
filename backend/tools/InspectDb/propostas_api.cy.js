/// <reference types="cypress" />

describe('API de Propostas', () => {
  let clienteCriado;

  // --- HOOKS ---
  // Antes de todos os testes, cria um cliente para ser usado como base
  before(() => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:5237/api/Clientes', // Ajuste a URL base se necessário
      body: {
        nome: `Cliente Cypress ${Date.now()}`,
        email: `cypress.${Date.now()}@teste.com`,
        status: 'Ativo',
      },
      failOnStatusCode: false, // Permite que o teste continue mesmo se a requisição falhar
    }).then((response) => {
      // Valida se o cliente foi criado com sucesso
      expect(response.status).to.be.oneOf([200, 201]);
      expect(response.body).to.have.property('id');
      clienteCriado = response.body;
    });
  });

  // --- TESTES ---

  context('Criação de Propostas', () => {
    it('Deve criar uma proposta com sucesso para um cliente existente', () => {
      const propostaPayload = {
        slides: 'Conteúdo dos slides gerado pela IA.',
        pdfUrl: 'http://example.com/proposta.pdf',
        statusValidacao: 'Aguardando Validação',
      };

      cy.request({
        method: 'POST',
        url: `http://localhost:5237/api/propostas-cliente/${clienteCriado.id}/criar`,
        body: propostaPayload,
      }).then((response) => {
        expect(response.status).to.equal(200); // Controller retorna Ok(200)
        expect(response.body).to.have.property('id');
        expect(response.body.clienteId).to.equal(clienteCriado.id);
        expect(response.body.nomeCliente).to.equal(clienteCriado.nome);
        expect(response.body.statusValidacao).to.equal('Aguardando Validação');
        expect(response.body.slides).to.equal(propostaPayload.slides);
      });
    });

    it('Deve retornar 404 ao tentar criar proposta para um cliente inexistente', () => {
      const idInexistente = 999999;
      cy.request({
        method: 'POST',
        url: `http://localhost:5237/api/propostas-cliente/${idInexistente}/criar`,
        body: {
          slides: 'Teste',
          statusValidacao: 'Pendente',
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message).to.contain('Cliente não encontrado');
      });
    });
  });

  context('Edição e Atualização de Status', () => {
    let propostaCriada;

    // Cria uma proposta antes de cada teste neste contexto
    beforeEach(() => {
      cy.request({
        method: 'POST',
        url: `http://localhost:5237/api/propostas-cliente/${clienteCriado.id}/criar`,
        body: {
          slides: 'Slides para edição',
          statusValidacao: 'Aguardando Validação',
        },
      }).then((response) => {
        propostaCriada = response.body;
      });
    });

    it('Deve atualizar o status de uma proposta para "Finalizada"', () => {
      const propostaAtualizada = {
        ...propostaCriada,
        statusValidacao: 'Finalizada',
      };

      cy.request({
        method: 'PUT',
        url: `http://localhost:5237/api/Propostas/${propostaCriada.id}`,
        body: propostaAtualizada,
      }).then((response) => {
        expect(response.status).to.equal(204); // NoContent é a resposta esperada para PUT bem-sucedido
      });

      // Verifica se a alteração foi persistida
      cy.request(`http://localhost:5237/api/Propostas/${propostaCriada.id}`).then((response) => {
        expect(response.body.statusValidacao).to.equal('Finalizada');
      });
    });

    it('Deve atualizar a mensagem da equipe ao rejeitar uma proposta', () => {
        const propostaAtualizada = {
          ...propostaCriada,
          statusValidacao: 'Rejeitada',
          mensagemEquipe: 'Faltam detalhes sobre o escopo do projeto.',
        };
  
        cy.request({
          method: 'PUT',
          url: `http://localhost:5237/api/Propostas/${propostaCriada.id}`,
          body: propostaAtualizada,
        }).then((response) => {
          expect(response.status).to.equal(204);
        });
  
        // Verifica se a mensagem foi salva
        cy.request(`http://localhost:5237/api/Propostas/${propostaCriada.id}`).then((response) => {
          expect(response.body.statusValidacao).to.equal('Rejeitada');
          expect(response.body.mensagemEquipe).to.equal('Faltam detalhes sobre o escopo do projeto.');
        });
      });
  });

  context('Exclusão de Propostas', () => {
    it('Deve excluir uma proposta com sucesso', () => {
      // 1. Criar uma proposta para garantir que ela exista
      cy.request({
        method: 'POST',
        url: `http://localhost:5237/api/propostas-cliente/${clienteCriado.id}/criar`,
        body: { slides: 'Proposta para deletar', statusValidacao: 'Pendente' },
      }).then((response) => {
        const propostaId = response.body.id;

        // 2. Excluir a proposta
        cy.request({
          method: 'DELETE',
          url: `http://localhost:5237/api/Propostas/${propostaId}`,
        }).then((deleteResponse) => {
          expect(deleteResponse.status).to.equal(204);
        });

        // 3. Verificar se a proposta foi realmente excluída (espera 404)
        cy.request({
          url: `http://localhost:5237/api/Propostas/${propostaId}`,
          failOnStatusCode: false,
        }).then((getResponse) => {
          expect(getResponse.status).to.equal(404);
        });
      });
    });
  });

  context('Geração de Conteúdo da Proposta', () => {
    it('Deve gerar o conteúdo de slides com base nos dados do lead', () => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:5237/gerar-proposta',
        body: {
          clientName: 'Empresa Teste',
          servico: 'Desenvolvimento de API',
          promptExtra: 'Focar em segurança e escalabilidade.',
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('slides');
        expect(response.body.slides).to.contain('Proposta para: Empresa Teste');
        expect(response.body.slides).to.contain('Serviço solicitado: Desenvolvimento de API');
        expect(response.body.slides).to.contain('Instruções adicionais:');
        expect(response.body.slides).to.contain('Focar em segurança e escalabilidade.');
      });
    });
  });
});