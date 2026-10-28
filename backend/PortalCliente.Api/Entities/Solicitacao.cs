using PortalCliente.Api.Entities.Enums;

namespace PortalCliente.Api.Entities;

public class Solicitacao
{
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public Categoria Categoria { get; set; }
    public Prioridade Prioridade { get; set; }
    public StatusSolicitacao Status { get; private set; } = StatusSolicitacao.Aberta;
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
    public DateTime? AtualizadoEm { get; set; }

    public void Cancelar()
    {
        if (Status != StatusSolicitacao.Aberta)
        {
            throw new InvalidOperationException("Só é possível cancelar solicitações com o status 'Aberta'");
        }
        Status = StatusSolicitacao.Cancelada;
        AtualizadoEm = DateTime.UtcNow;
    }
}