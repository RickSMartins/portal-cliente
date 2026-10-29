using Microsoft.EntityFrameworkCore;
using PortalCliente.Api.Data;
using PortalCliente.Api.DTOs.Perfil;
using PortalCliente.Api.Entities;

namespace PortalCliente.Api.Services;

public class PerfilService
{
    private readonly AppDbContext _context;

    public PerfilService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<PerfilResponse> ObterAsync(int clienteId)
    {
        var cliente = await BuscarClienteAsync(clienteId);
        return ParaResponse(cliente);
    }

    public async Task<PerfilResponse> AtualizarAsync(int clienteId, AtualizarPerfilRequest request)
    {
        var cliente = await BuscarClienteAsync(clienteId);

        cliente.Nome = request.Nome.Trim();
        cliente.Telefone = request.Telefone.Trim();

        await _context.SaveChangesAsync();

        return ParaResponse(cliente);
    }

    private async Task<Cliente> BuscarClienteAsync(int clienteId)
    {
        var cliente = await _context.Clientes.FindAsync(clienteId);
        if (cliente is null)
            throw new KeyNotFoundException("Cliente não encontrado.");
        return cliente;
    }

    private static PerfilResponse ParaResponse(Cliente cliente) => new()
    {
        Id = cliente.Id,
        Nome = cliente.Nome,
        Email = cliente.Email,
        Telefone = cliente.Telefone,
        CriadoEm = cliente.CriadoEm
    };
}