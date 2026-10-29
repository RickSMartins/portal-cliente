using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PortalCliente.Api.DTOs.Solicitacoes;
using PortalCliente.Api.Entities.Enums;
using PortalCliente.Api.Services;

namespace PortalCliente.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SolicitacoesController : ControllerBase
{
    private readonly SolicitacaoService _solicitacaoService;

    public SolicitacoesController(SolicitacaoService solicitacaoService)
    {
        _solicitacaoService = solicitacaoService;
    }

    private int ClienteId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    public async Task<IActionResult> Criar(CriarSolicitacaoRequest request)
    {
        var solicitacao = await _solicitacaoService.CriarAsync(ClienteId, request);
        return CreatedAtAction(nameof(Obter), new { id = solicitacao.Id }, solicitacao);
    }

    [HttpGet]
    public async Task<IActionResult> Listar([FromQuery] StatusSolicitacao? status)
    {
        var solicitacoes = await _solicitacaoService.ListarAsync(ClienteId, status);
        return Ok(solicitacoes);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Obter(int id)
    {
        try
        {
            var solicitacao = await _solicitacaoService.ObterAsync(ClienteId, id);
            return Ok(solicitacao);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { mensagem = ex.Message });
        }
    }

    [HttpPatch("{id:int}/cancelar")]
    public async Task<IActionResult> Cancelar(int id)
    {
        try
        {
            var solicitacao = await _solicitacaoService.CancelarAsync(ClienteId, id);
            return Ok(solicitacao);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { mensagem = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { mensagem = ex.Message });
        }
    }
}