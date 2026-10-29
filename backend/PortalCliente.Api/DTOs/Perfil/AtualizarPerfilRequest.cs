using System.ComponentModel.DataAnnotations;

namespace PortalCliente.Api.DTOs.Perfil;

public class AtualizarPerfilRequest
{
    [Required(ErrorMessage = "O nome é obrigatório.")]
    [MaxLength(100, ErrorMessage = "O nome deve ter no máximo 100 caracteres.")]
    public string Nome { get; set; } = string.Empty;

    [Required(ErrorMessage = "O telefone é obrigatório.")]
    [MaxLength(20, ErrorMessage = "O telefone deve ter no máximo 20 caracteres.")]
    public string Telefone { get; set; } = string.Empty;
}