using PortalCliente.Api.Entities.Enums;

namespace PortalCliente.Api.DTOs.Solicitacoes;

public class SolicitacaoResponse
{
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public Categoria Categoria { get; set; }
    public Prioridade Prioridade { get; set; }
    public StatusSolicitacao Status { get; set; }
    public DateTime CriadoEm { get; set; }
    public DateTime? AtualizadoEm { get; set; }
}