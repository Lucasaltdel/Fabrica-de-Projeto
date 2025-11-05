using System;

namespace ProjetoApiPT.Domain.Entities
{
    public class EnvioFormulario
    {
        public int Id { get; set; }
        public string NomeLead { get; set; } = null!;
        public string EmailContato { get; set; } = null!;
        public string StatusEnvio { get; set; } = "Pendente";
        
        // Chave Estrangeira (FK)
        public int IdModelo { get; set; } 
        
        public string DadosFormularioJson { get; set; } = null!;
        public DateTime DataEnvio { get; set; } = DateTime.UtcNow;

        // -----------------------------------------------------------------
        // CORREÇÃO: ADIÇÃO DA PROPRIEDADE DE NAVEGAÇÃO
        // -----------------------------------------------------------------
        
        /// <summary>
        /// Objeto de navegação para o Modelo associado (Relação N:1).
        /// O 'null!' garante que o EF Core trate como obrigatório, já que IdModelo é int (não-nulo).
        /// </summary>
        public Modelo Modelo { get; set; } = null!; 
    }
}