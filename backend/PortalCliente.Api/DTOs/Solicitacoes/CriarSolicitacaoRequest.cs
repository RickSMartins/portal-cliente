using System.ComponentModel.DataAnnotations;
using PortalCliente.Api.Entities.Enums;

namespace PortalCliente.Api.DTOs.Solicitacoes;

public class CriarSolicitacaoRequest
{
    [Required(ErrorMessage = "O título é obrigatório.")]
    [MaxLength(100, ErrorMessage = "O título deve ter no máximo 100 caracteres.")]
    public string Titulo { get; set; } = string.Empty;

    [Required(ErrorMessage = "A descrição é obrigatória.")]
    [MaxLength(2000, ErrorMessage = "A descrição deve ter no máximo 2000 caracteres.")]
    public string Descricao { get; set; } = string.Empty;

    [Required(ErrorMessage = "A categoria é obrigatória.")]
    public Categoria? Categoria { get; set; }

    [Required(ErrorMessage = "A prioridade é obrigatória.")]
    public Prioridade? Prioridade { get; set; }
}