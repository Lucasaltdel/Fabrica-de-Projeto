namespace ProjetoApi.Application.DTOs
{
    public class ClientDTO
    {
        public int Id { get; set; }
        public required string Nome { get; set; }
        public required string Email { get; set; }
        public required string Status { get; set; }
        public int QuantidadeTemplates { get; set; }
        public bool PdfGerado { get; set; }
        public DateTime DataCadastro { get; set; }
    }
}
