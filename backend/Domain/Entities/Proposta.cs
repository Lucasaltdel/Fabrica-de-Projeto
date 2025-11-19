using System;

namespace ProjetoApiPT.Domain.Entities
{
    /// <summary>
    /// Representa a entidade Proposta no sistema.
    /// Esta classe corresponde à tabela 'Propostas' no banco de dados.
    /// </summary>
    public class Proposta
    {
        /// <summary>
        /// Identificador único da Proposta (Chave Primária).
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Nome do Cliente associado à Proposta. Não pode ser nulo.
        /// </summary>
        public string NomeCliente { get; set; } = null!;

        /// <summary>
        /// Endereço de e-mail do Cliente associado à Proposta. Não pode ser nulo.
        /// </summary>
        public string EmailCliente { get; set; } = null!;

        /// <summary>
        /// Data em que a Proposta foi criada ou é válida.
        /// </summary>
        public DateTime DataProposta { get; set; }

        /// <summary>
        /// Status da validação da Proposta (ex: Pendente, Aprovada, Rejeitada). Não pode ser nulo.
        /// </summary>
        public string StatusValidacao { get; set; } = null!;

        /// <summary>
        /// Mensagem opcional da equipe interna sobre a Proposta.
        /// </summary>
        public string? MensagemEquipe { get; set; }

        /// <summary>
        /// Valor monetário total da Proposta.
        /// </summary>
        public decimal Valor { get; set; }

        /// <summary>
        /// Nome do responsável pela criação ou acompanhamento da Proposta.
        /// </summary>
        public string? Responsavel { get; set; }

        /// <summary>
        /// Data e hora da criação do registro da Proposta. Define o valor padrão como a hora UTC atual.
        /// </summary>
        public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
    }
}
