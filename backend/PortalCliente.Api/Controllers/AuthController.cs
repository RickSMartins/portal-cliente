using Microsoft.AspNetCore.Mvc;
using PortalCliente.Api.DTOs.Auth;
using PortalCliente.Api.Services;

namespace PortalCliente.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("cadastro")]
    public async Task<IActionResult> Cadastar(CadastroRequest request)
    {
        try
        {
            await _authService.CadastrarAsync(request);
            return StatusCode(StatusCodes.Status201Created);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }
}