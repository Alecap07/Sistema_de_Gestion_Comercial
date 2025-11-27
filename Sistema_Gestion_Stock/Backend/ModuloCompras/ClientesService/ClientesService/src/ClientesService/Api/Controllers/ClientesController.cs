using ClientesService.Application.DTOs;
using ClientesService.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace ClientesService.Api.Controllers;

[ApiController]
[Route("api/clientes")]
public class ClientesController : ControllerBase
{
    private readonly IClientesService _service;

    public ClientesController(IClientesService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> List()
    {
        // includeInactive=true para traer activos e inactivos
        var r = await _service.ListAsync(true);
        return Ok(r.Data);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id)
    {
        var r = await _service.GetAsync(id);
        return r.Success ? Ok(r.Data) : NotFound(new { r.Error });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ClienteCreateDto dto)
    {
        var r = await _service.CreateAsync(dto);
        return Created($"/api/clientes/{r.Data}", new { id = r.Data });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] ClienteUpdateDto dto)
    {
        var r = await _service.UpdateAsync(id, dto);
        return r.Success ? NoContent() : NotFound(new { r.Error });
    }

    [HttpPatch("{id:int}/soft-delete")]
    public async Task<IActionResult> SoftDelete(int id)
    {
        var r = await _service.DeleteAsync(id); // Baja lógica (Activo=false)
        return r.Success ? NoContent() : NotFound(new { r.Error });
    }
}