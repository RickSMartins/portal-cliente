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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.Property(c => c.Nome).HasMaxLength(100);
            entity.Property(c => c.Email).HasMaxLength(150);
            entity.Property(c => c.Telefone).HasMaxLength(20);
            entity.Property(c => c.SenhaHash).HasMaxLength(256);

            entity.HasIndex(c => c.Email).IsUnique();
        });

        modelBuilder.Entity<Solicitacao>(entity =>
        {
            entity.Property(s => s.Titulo).HasMaxLength(100);
            entity.Property(s => s.Descricao).HasMaxLength(2000);
            entity.Property(s => s.Categoria).HasConversion<string>().HasMaxLength(20);
            entity.Property(s => s.Prioridade).HasConversion<string>().HasMaxLength(20);
            entity.Property(s => s.Status).HasConversion<string>().HasMaxLength(20);

            entity.HasOne(s => s.Cliente)
                  .WithMany(c => c.Solicitacoes)
                  .HasForeignKey(s => s.ClienteId)
                  .OnDelete(DeleteBehavior.Restrict);
        });
    }
}