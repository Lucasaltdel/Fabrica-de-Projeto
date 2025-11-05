using System;

namespace ProjetoApiPT.Domain.Entities
{
    /// <summary>
    /// Representa a entidade Cliente no sistema.
    /// Esta classe corresponde à tabela 'Clientes' no banco de dados.
    /// </summary>
    public class Cliente
    {
        /// <summary>
        /// Identificador único do Cliente (Chave Primária).
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Nome completo do Cliente. Não pode ser nulo.
        /// </summary>
        public string Nome { get; set; } = null!;

        /// <summary>
        /// Endereço de e-mail do Cliente. Não pode ser nulo.
        /// </summary>
        public string Email { get; set; } = null!;

        /// <summary>
        /// Status atual do Cliente (ex: Ativo, Inativo, Pendente). Não pode ser nulo.
        /// </summary>
        public string Status { get; set; } = null!;

        /// <summary>
        /// Número de modelos (Templates) associados a este Cliente.
        /// </summary>
        public int QuantidadeTemplates { get; set; }

        /// <summary>
        /// Indica se o PDF foi gerado para este Cliente.
        /// </summary>
        public bool PdfGerado { get; set; }

        /// <summary>
        /// Data e hora do cadastro do Cliente. Define o valor padrão como a hora UTC atual.
        /// </summary>
        public DateTime DataCadastro { get; set; } = DateTime.UtcNow;
    }
}
