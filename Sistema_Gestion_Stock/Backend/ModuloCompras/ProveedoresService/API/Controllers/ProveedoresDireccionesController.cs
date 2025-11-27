using Microsoft.AspNetCore.Mvc;
using ProveedoresService.Application.DTOs;
using ProveedoresService.Application.Interfaces;
using ProveedoresService.Common.Enums;

namespace ProveedoresService.API.Controllers;

[ApiController]
[Route("api/proveedores")]
public class ProveedoresDireccionesController : ControllerBase
{
    private readonly IProveedorDireccionService _service;
    public ProveedoresDireccionesController(IProveedorDireccionService service) => _service = service;

    // Listar todas las direcciones del proveedor (filtro por estado)
    [HttpGet("{proveedorId:int}/direcciones")]
    public async Task<ActionResult<IEnumerable<ProveedorDireccionDTO>>> GetByProveedor(int proveedorId, [FromQuery] EstadoFiltro estado = EstadoFiltro.Activos, CancellationToken ct = default)
    {
        var lista = await _service.GetByProveedorAsync(proveedorId, estado, ct);
        return Ok(lista);
    }

    // Obtener dirección individual por ID
    [HttpGet("direcciones/{id:int}")]
    public async Task<ActionResult<ProveedorDireccionDTO>> GetById(int id, CancellationToken ct = default)
    {
        var dir = await _service.GetByIdAsync(id, ct);
        return dir == null ? NotFound() : Ok(dir);
    }

    // Crear dirección (POST)
    [HttpPost("{proveedorId:int}/direcciones")]
    public async Task<ActionResult<int>> Create(int proveedorId, [FromBody] ProveedorDireccionCreateDTO dto, CancellationToken ct)
    {
        var newId = await _service.CreateAsync(proveedorId, dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = newId }, newId);
    }

    // Modificar dirección (PUT)
    [HttpPut("direcciones/{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] ProveedorDireccionUpdateDTO dto, CancellationToken ct)
    {
        await _service.UpdateAsync(id, dto, ct);
        return NoContent();
    }
}