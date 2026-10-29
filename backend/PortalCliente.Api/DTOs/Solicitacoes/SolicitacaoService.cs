using Microsoft.EntityFrameworkCore;
using PortalCliente.Api.Data;
using PortalCliente.Api.DTOs.Solicitacoes;
using PortalCliente.Api.Entities;
using PortalCliente.Api.Entities.Enums;

namespace PortalCliente.Api.Services;

public class SolicitacaoService
{
    private readonly AppDbContext _context;

    public SolicitacaoService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<SolicitacaoResponse> CriarAsync(int clienteId, CriarSolicitacaoRequest request)
    {
        var solicitacao = new Solicitacao
        {
            Titulo = request.Titulo.Trim(),
            Descricao = request.Descricao.Trim(),
            Categoria = request.Categoria!.Value,
            Prioridade = request.Prioridade!.Value,
            ClienteId = clienteId
        };

        _context.Solicitacoes.Add(solicitacao);
        await _context.SaveChangesAsync();

        return ParaResponse(solicitacao);
    }

    public async Task<List<SolicitacaoResponse>> ListarAsync(int clienteId, StatusSolicitacao? status)
    {
        var consulta = _context.Solicitacoes.Where(s => s.ClienteId == clienteId);

        if (status.HasValue)
            consulta = consulta.Where(s => s.Status == status.Value);

        var solicitacoes = await consulta
            .OrderByDescending(s => s.CriadoEm)
            .ToListAsync();

        return solicitacoes.Select(ParaResponse).ToList();
    }

    public async Task<SolicitacaoResponse> ObterAsync(int clienteId, int id)
    {
        var solicitacao = await BuscarAsync(clienteId, id);
        return ParaResponse(solicitacao);
    }

    public async Task<SolicitacaoResponse> CancelarAsync(int clienteId, int id)
    {
        var solicitacao = await BuscarAsync(clienteId, id);

        solicitacao.Cancelar();
        await _context.SaveChangesAsync();

        return ParaResponse(solicitacao);
    }

    private async Task<Solicitacao> BuscarAsync(int clienteId, int id)
    {
        var solicitacao = await _context.Solicitacoes
            .FirstOrDefaultAsync(s => s.Id == id && s.ClienteId == clienteId);

        if (solicitacao is null)
            throw new KeyNotFoundException("Solicitação não encontrada.");

        return solicitacao;
    }

    private static SolicitacaoResponse ParaResponse(Solicitacao s) => new()
    {
        Id = s.Id,
        Titulo = s.Titulo,
        Descricao = s.Descricao,
        Categoria = s.Categoria,
        Prioridade = s.Prioridade,
        Status = s.Status,
        CriadoEm = s.CriadoEm,
        AtualizadoEm = s.AtualizadoEm
    };
}