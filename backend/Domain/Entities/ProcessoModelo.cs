using System;

namespace ProjetoApiPT.Domain.Entities
{
    /// <summary>
    /// Representa um Processo associado a um Modelo (Template) específico.
    /// Esta classe corresponde à tabela 'TemplateProcesses' no banco de dados.
    /// </summary>
    public class ProcessoModelo
    {
        /// <summary>
        /// Identificador único do Processo do Modelo (Chave Primária).
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// ID do Modelo ao qual este processo está associado.
        /// </summary>
        public int IdModelo { get; set; }

        /// <summary>
        /// Descrição do Processo a ser executado (ex: Envio de Email, Geração de PDF). Não pode ser nulo.
        /// </summary>
        public string DescricaoProcesso { get; set; } = null!;

        /// <summary>
        /// Data prevista para a execução deste processo. Pode ser nula.
        /// </summary>
        public DateTime? DataPrevista { get; set; }

        /// <summary>
        /// Hora prevista para a execução deste processo. Pode ser nula.
        /// </summary>
        public TimeSpan? HoraPrevista { get; set; }

        /// <summary>
        /// Objeto de navegação para o Modelo associado.
        /// </summary>
        public Modelo? Modelo { get; set; }
    }
}
