using Microsoft.EntityFrameworkCore;
using PortalCliente.Api.Entities;

namespace PortalCliente.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Cliente> Clientes { get; set; }
    public DbSet<Solicitacao> Solicitacoes { get; set; }
}