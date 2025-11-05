using System;
using System.Collections.Generic; // <--- Importante para ICollection

namespace ProjetoApiPT.Domain.Entities
{
    public class Modelo
    {
        public int Id { get; set; }
        public string Titulo { get; set; } = null!;
        public string? Descricao { get; set; }
        public string Plano { get; set; } = null!;
        public string Status { get; set; } = null!; // Adicionado Status do seu modelo de dados
        public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

        // -----------------------------------------------------------------
        // CORREÇÃO: ADIÇÃO DAS PROPRIEDADES DE NAVEGAÇÃO
        // -----------------------------------------------------------------
        
        /// <summary>
        /// Coleção de envios de formulário associados a este Modelo. (Relação 1:N)
        /// </summary>
        public ICollection<EnvioFormulario> EnviosFormularios { get; set; } = new List<EnvioFormulario>();

        /// <summary>
        /// Coleção de processos associados a este Modelo. (Relação 1:N)
        /// </summary>
        public ICollection<ProcessoModelo> ProcessosModelos { get; set; } = new List<ProcessoModelo>();
    }
}