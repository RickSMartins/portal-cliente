using Microsoft.AspNetCore.Mvc;
using PortalCliente.Api.DTOs.Auth;
using PortalCliente.Api.Services;

namespace PortalCliente.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    public const string NomeCookie = "portal_token";

    private readonly AuthService _authService;
    private readonly IConfiguration _configuration;

    public AuthController(AuthService authService, IConfiguration configuration)
    {
        _authService = authService;
        _configuration = configuration;
    }

    [HttpPost("cadastro")]
    public async Task<IActionResult> Cadastrar(CadastroRequest request)
    {
        try
        {
            await _authService.CadastrarAsync(request);
            return StatusCode(StatusCodes.Status201Created);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { mensagem = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        try
        {
            var resposta = await _authService.LoginAsync(request);

            var horas = int.Parse(_configuration["Jwt:ExpiracaoHoras"]!);
            Response.Cookies.Append(NomeCookie, resposta.Token, CriarOpcoesCookie(DateTimeOffset.UtcNow.AddHours(horas)));

            return Ok(new { nome = resposta.Nome });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { mensagem = ex.Message });
        }
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete(NomeCookie, CriarOpcoesCookie(null));
        return NoContent();
    }

    private CookieOptions CriarOpcoesCookie(DateTimeOffset? expiraEm) => new()
    {
        HttpOnly = true,
        Secure = Request.IsHttps,
        SameSite = SameSiteMode.Strict,
        Path = "/",
        Expires = expiraEm
    };
}