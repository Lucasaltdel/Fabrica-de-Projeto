using System.Collections.Generic;
using System.Threading.Tasks;
using ProjetoApiPT.Domain.Entities;

namespace ProjetoApiPT.Domain.Ports
{
    /// <summary>
    /// Define o contrato para operações de persistência de dados (CRUD) da entidade Proposta.
    /// Esta interface segue o padrão Repository e permite a abstração do acesso aos dados.
    /// </summary>
    public interface IPropostaRepositorio
    {
        /// <summary>
        /// Adiciona uma nova Proposta ao repositório.
        /// </summary>
        /// <param name="proposta">O objeto Proposta a ser criado. Não pode ser nulo.</param>
        /// <returns>A Proposta criada, incluindo seu Id gerado pelo banco de dados.</returns>
        Task<Proposta> CriarAsync(Proposta proposta);

        /// <summary>
        /// Retorna todas as Propostas do repositório.
        /// </summary>
        /// <returns>Uma coleção de todas as Propostas cadastradas. Pode retornar uma lista vazia.</returns>
        Task<IEnumerable<Proposta>> ObterTodosAsync();

        /// <summary>
        /// Retorna uma Proposta pelo seu identificador único.
        /// </summary>
        /// <param name="id">O Id da Proposta a ser recuperada.</param>
        /// <returns>A Proposta correspondente ou null se não for encontrada.</returns>
        Task<Proposta?> ObterPorIdAsync(int id);

        /// <summary>
        /// Atualiza as informações de uma Proposta existente.
        /// </summary>
        /// <param name="proposta">O objeto Proposta com os dados atualizados. Não pode ser nulo.</param>
        Task AtualizarAsync(Proposta proposta);

        /// <summary>
        /// Remove uma Proposta do repositório pelo seu identificador.
        /// </summary>
        /// <param name="id">O Id da Proposta a ser removida.</param>
        Task ExcluirAsync(int id);
    }
}
