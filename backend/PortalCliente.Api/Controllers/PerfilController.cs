using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PortalCliente.Api.DTOs.Perfil;
using PortalCliente.Api.Services;

namespace PortalCliente.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PerfilController : ControllerBase
{
    private readonly PerfilService _perfilService;

    public PerfilController(PerfilService perfilService)
    {
        _perfilService = perfilService;
    }

    private int ClienteId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> Obter()
    {
        try
        {
            var perfil = await _perfilService.ObterAsync(ClienteId);
            return Ok(perfil);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { mensagem = ex.Message });
        }
    }

    [HttpPut]
    public async Task<IActionResult> Atualizar(AtualizarPerfilRequest request)
    {
        try
        {
            var perfil = await _perfilService.AtualizarAsync(ClienteId, request);
            return Ok(perfil);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { mensagem = ex.Message});
        }
    }
}