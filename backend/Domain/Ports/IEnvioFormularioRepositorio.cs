using System.Collections.Generic;
using System.Threading.Tasks;
using ProjetoApiPT.Domain.Entities;

namespace ProjetoApiPT.Domain.Ports
{
    /// <summary>
    /// Define o contrato para operações de persistência de dados (CRUD) da entidade EnvioFormulario.
    /// Esta interface segue o padrão Repository e permite a abstração do acesso aos dados.
    /// </summary>
    public interface IEnvioFormularioRepositorio
    {
        /// <summary>
        /// Adiciona um novo Envio de Formulário ao repositório.
        /// </summary>
        /// <param name="envio">O objeto EnvioFormulario a ser criado. Não pode ser nulo.</param>
        /// <returns>O EnvioFormulario criado, incluindo seu Id gerado pelo banco de dados.</returns>
        Task<EnvioFormulario> CriarAsync(EnvioFormulario envio);

        /// <summary>
        /// Retorna um Envio de Formulário pelo seu identificador único.
        /// </summary>
        /// <param name="id">O Id do Envio de Formulário a ser recuperado.</param>
        /// <returns>O EnvioFormulario correspondente ou null se não for encontrado.</returns>
        Task<EnvioFormulario?> ObterPorIdAsync(int id);

        /// <summary>
        /// Retorna todos os Envios de Formulário do repositório.
        /// </summary>
        /// <returns>Uma coleção de todos os Envios de Formulário cadastrados. Pode retornar uma lista vazia.</returns>
        Task<IEnumerable<EnvioFormulario>> ListarAsync();

        /// <summary>
        /// Atualiza as informações de um Envio de Formulário existente.
        /// </summary>
        /// <param name="envio">O objeto EnvioFormulario com os dados atualizados. Não pode ser nulo.</param>
        Task AtualizarAsync(EnvioFormulario envio);

        /// <summary>
        /// Remove um Envio de Formulário do repositório pelo seu identificador.
        /// </summary>
        /// <param name="id">O Id do Envio de Formulário a ser removido.</param>
        Task ExcluirAsync(int id);
    }
}
