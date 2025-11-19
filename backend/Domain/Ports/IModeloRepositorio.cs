using System.Collections.Generic;
using System.Threading.Tasks;
using ProjetoApiPT.Domain.Entities;

namespace ProjetoApiPT.Domain.Ports
{
    /// <summary>
    /// Define o contrato para operações de persistência de dados (CRUD) da entidade Modelo (Template).
    /// Esta interface segue o padrão Repository e permite a abstração do acesso aos dados.
    /// </summary>
    public interface IModeloRepositorio
    {
        /// <summary>
        /// Adiciona um novo Modelo ao repositório.
        /// </summary>
        /// <param name="modelo">O objeto Modelo a ser criado. Não pode ser nulo.</param>
        /// <returns>O Modelo criado, incluindo seu Id gerado pelo banco de dados.</returns>
        Task<Modelo> CriarAsync(Modelo modelo);

        /// <summary>
        /// Retorna todos os Modelos do repositório.
        /// </summary>
        /// <returns>Uma coleção de todos os Modelos cadastrados. Pode retornar uma lista vazia.</returns>
        Task<IEnumerable<Modelo>> ObterTodosAsync();

        /// <summary>
        /// Retorna um Modelo pelo seu identificador único.
        /// </summary>
        /// <param name="id">O Id do Modelo a ser recuperado.</param>
        /// <returns>O Modelo correspondente ou null se não for encontrado.</returns>
        Task<Modelo?> ObterPorIdAsync(int id);

        /// <summary>
        /// Atualiza as informações de um Modelo existente.
        /// </summary>
        /// <param name="modelo">O objeto Modelo com os dados atualizados. Não pode ser nulo.</param>
        Task AtualizarAsync(Modelo modelo);

        /// <summary>
        /// Remove um Modelo do repositório pelo seu identificador.
        /// </summary>
        /// <param name="id">O Id do Modelo a ser removido.</param>
        Task ExcluirAsync(int id);
    }
}
