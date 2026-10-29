using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PortalCliente.Api.Data;
using PortalCliente.Api.DTOs.Auth;
using PortalCliente.Api.Entities;

namespace PortalCliente.Api.Services;

public class AuthService
{
    private readonly AppDbContext _context;
    private readonly IPasswordHasher<Cliente> _passwordHasher;
    private readonly TokenService _tokenService;

    public AuthService(AppDbContext context, IPasswordHasher<Cliente> passwordHasher, TokenService tokenService)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
    }

    public async Task CadastrarAsync(CadastroRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        if (await _context.Clientes.AnyAsync(c => c.Email == email))
        {
            throw new InvalidOperationException("Já existe um cliente cadastrado com este e-mail.");
        }

        var cliente = new Cliente
        {
            Nome = request.Nome.Trim(),
            Email = request.Email.Trim().ToLowerInvariant(),
            Telefone = request.Telefone.Trim()
        };

        cliente.SenhaHash = _passwordHasher.HashPassword(cliente, request.Senha);

        _context.Clientes.Add(cliente);
        await _context.SaveChangesAsync();
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        var cliente = await _context.Clientes.FirstOrDefaultAsync(c => c.Email == email);

        if (cliente is null ||
            _passwordHasher.VerifyHashedPassword(cliente, cliente.SenhaHash, request.Senha)
                == PasswordVerificationResult.Failed)
        {
            throw new UnauthorizedAccessException("E-mail ou senha inválidos.");
        }

        return new LoginResponse
        {
            Token = _tokenService.GerarToken(cliente),
            Nome = cliente.Nome
        };
    }

}