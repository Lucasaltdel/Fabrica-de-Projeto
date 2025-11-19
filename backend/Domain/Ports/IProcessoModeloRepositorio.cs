using System.Collections.Generic;
using System.Threading.Tasks;
using ProjetoApiPT.Domain.Entities;

namespace ProjetoApiPT.Domain.Ports
{
    /// <summary>
    /// Define o contrato para operações de persistência de dados (CRUD) da entidade ProcessoModelo.
    /// Esta interface segue o padrão Repository e permite a abstração do acesso aos dados.
    /// </summary>
    public interface IProcessoModeloRepositorio
    {
        /// <summary>
        /// Adiciona um novo Processo de Modelo ao repositório.
        /// </summary>
        /// <param name="processo">O objeto ProcessoModelo a ser criado. Não pode ser nulo.</param>
        /// <returns>O ProcessoModelo criado, incluindo seu Id gerado pelo banco de dados.</returns>
        Task<ProcessoModelo> CriarAsync(ProcessoModelo processo);

        /// <summary>
        /// Retorna todos os Processos de Modelo associados a um Modelo específico.
        /// </summary>
        /// <param name="idModelo">O Id do Modelo para filtrar os processos.</param>
        /// <returns>Uma coleção de ProcessosModelo associados ao Id do Modelo. Pode retornar uma lista vazia.</returns>
        Task<IEnumerable<ProcessoModelo>> ObterPorIdModeloAsync(int idModelo);

        /// <summary>
        /// Retorna um Processo de Modelo pelo seu identificador único.
        /// </summary>
        /// <param name="id">O Id do Processo de Modelo a ser recuperado.</param>
        /// <returns>O ProcessoModelo correspondente ou null se não for encontrado.</returns>
        Task<ProcessoModelo?> ObterPorIdAsync(int id);

        /// <summary>
        /// Atualiza as informações de um Processo de Modelo existente.
        /// </summary>
        /// <param name="processo">O objeto ProcessoModelo com os dados atualizados. Não pode ser nulo.</param>
        Task AtualizarAsync(ProcessoModelo processo);

        /// <summary>
        /// Remove um Processo de Modelo do repositório pelo seu identificador.
        /// </summary>
        /// <param name="id">O Id do Processo de Modelo a ser removido.</param>
        Task ExcluirAsync(int id);
    }
}
