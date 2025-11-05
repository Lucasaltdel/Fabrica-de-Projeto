using System;

namespace ProjetoApiPT.Domain.Entities
{
    /// <summary>
    /// Representa a entidade Usuário no sistema.
    /// Esta classe corresponde à tabela 'Users' no banco de dados e contém informações de autenticação e perfil.
    /// </summary>
    public class Usuario
    {
        /// <summary>
        /// Identificador único do Usuário (Chave Primária).
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Nome de usuário (login) do Usuário. Não pode ser nulo.
        /// </summary>
        public string NomeUsuario { get; set; } = null!;

        /// <summary>
        /// Endereço de e-mail do Usuário. Não pode ser nulo.
        /// </summary>
        public string Email { get; set; } = null!;

        /// <summary>
        /// Hash da senha do Usuário para armazenamento seguro. Não pode ser nulo.
        /// </summary>
        public string HashSenha { get; set; } = null!;

        /// <summary>
        /// Papel ou perfil de acesso do Usuário (ex: Admin, User, Guest). Padrão é "User".
        /// </summary>
        public string PerfilAcesso { get; set; } = "User";

        /// <summary>
        /// Data e hora da criação do registro do Usuário. Define o valor padrão como a hora UTC atual.
        /// </summary>
        public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
    }
}
