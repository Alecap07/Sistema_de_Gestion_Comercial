using Microsoft.AspNetCore.Mvc;
using ProveedoresService.Application.DTOs;
using ProveedoresService.Application.Interfaces;
using ProveedoresService.Common.Enums;

namespace ProveedoresService.API.Controllers;

[ApiController]
[Route("api/proveedores")]
public class ProveedorProductosController : ControllerBase
{
    private readonly IProveedorProductoService _service;
    public ProveedorProductosController(IProveedorProductoService service) => _service = service;

    [HttpGet("{proveedorId:int}/productos")]
    public async Task<ActionResult<IEnumerable<ProveedorProductoDTO>>> GetByProveedor(int proveedorId, [FromQuery] EstadoFiltro estado = EstadoFiltro.Activos, CancellationToken ct = default)
    {
        var lista = await _service.GetByProveedorAsync(proveedorId, estado, ct);
        return Ok(lista);
    }

    [HttpGet("productos/{id:int}")]
    public async Task<ActionResult<ProveedorProductoDTO>> GetById(int id, CancellationToken ct = default)
    {
        var obj = await _service.GetByIdAsync(id, ct);
        return obj == null ? NotFound() : Ok(obj);
    }

    [HttpPost("{proveedorId:int}/productos")]
    public async Task<ActionResult<int>> Create(int proveedorId, [FromBody] ProveedorProductoCreateDTO dto, CancellationToken ct)
    {
        var newId = await _service.CreateAsync(proveedorId, dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = newId }, newId);
    }

    [HttpPut("productos/{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] ProveedorProductoUpdateDTO dto, CancellationToken ct)
    {
        await _service.UpdateAsync(id, dto, ct);
        return NoContent();
    }
}