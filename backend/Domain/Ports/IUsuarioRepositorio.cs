using System.Collections.Generic;
using System.Threading.Tasks;
using ProjetoApiPT.Domain.Entities;

namespace ProjetoApiPT.Domain.Ports
{
    /// <summary>
    /// Define o contrato para operações de persistência de dados (CRUD) da entidade Usuario.
    /// Esta interface segue o padrão Repository e permite a abstração do acesso aos dados.
    /// </summary>
    public interface IUsuarioRepositorio
    {
        /// <summary>
        /// Retorna um Usuário pelo seu identificador único.
        /// </summary>
        /// <param name="id">O Id do Usuário a ser recuperado.</param>
        /// <returns>O Usuário correspondente ou null se não for encontrado.</returns>
        Task<Usuario?> ObterPorIdAsync(int id);

        /// <summary>
        /// Retorna um Usuário pelo seu nome de usuário (login).
        /// </summary>
        /// <param name="nomeUsuario">O nome de usuário (login) do Usuário a ser recuperado.</param>
        /// <returns>O Usuário correspondente ou null se não for encontrado.</returns>
        Task<Usuario?> ObterPorNomeUsuarioAsync(string nomeUsuario);

        /// <summary>
        /// Retorna um Usuário pelo seu endereço de e-mail.
        /// </summary>
        /// <param name="email">O endereço de e-mail do Usuário a ser recuperado.</param>
        /// <returns>O Usuário correspondente ou null se não for encontrado.</returns>
        Task<Usuario?> ObterPorEmailAsync(string email);

        /// <summary>
        /// Adiciona um novo Usuário ao repositório.
        /// </summary>
        /// <param name="usuario">O objeto Usuario a ser criado. Não pode ser nulo.</param>
        Task CriarAsync(Usuario usuario);

        /// <summary>
        /// Retorna todos os Usuários do repositório.
        /// </summary>
        /// <returns>Uma coleção de todos os Usuários cadastrados. Pode retornar uma lista vazia.</returns>
        Task<IEnumerable<Usuario>> ObterTodosAsync();

        /// <summary>
        /// Atualiza as informações de um Usuário existente.
        /// </summary>
        /// <param name="usuario">O objeto Usuario com os dados atualizados. Não pode ser nulo.</param>
        Task AtualizarAsync(Usuario usuario);

        /// <summary>
        /// Remove um Usuário do repositório pelo seu identificador.
        /// </summary>
        /// <param name="id">O Id do Usuário a ser removido.</param>
        Task ExcluirAsync(int id);
    }
}
