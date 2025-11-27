using Microsoft.AspNetCore.Mvc;
using ProveedoresService.Application.DTOs;
using ProveedoresService.Application.Interfaces;
using ProveedoresService.Common.Enums;

namespace ProveedoresService.API.Controllers;

[ApiController]
[Route("api/proveedores")]
public class ProveedoresTelefonosController : ControllerBase
{
    private readonly IProveedorTelefonoService _service;
    public ProveedoresTelefonosController(IProveedorTelefonoService service) => _service = service;

    // Listar todos los teléfonos de un proveedor (filtro por estado)
    [HttpGet("{proveedorId:int}/telefonos")]
    public async Task<ActionResult<IEnumerable<ProveedorTelefonoDTO>>> GetByProveedor(int proveedorId, [FromQuery] EstadoFiltro estado = EstadoFiltro.Activos, CancellationToken ct = default)
    {
        var lista = await _service.GetByProveedorAsync(proveedorId, estado, ct);
        return Ok(lista);
    }

    // Traer un teléfono por ID
    [HttpGet("telefonos/{id:int}")]
    public async Task<ActionResult<ProveedorTelefonoDTO>> GetById(int id, CancellationToken ct = default)
    {
        var tel = await _service.GetByIdAsync(id, ct);
        return tel == null ? NotFound() : Ok(tel);
    }

    // Crear teléfono (POST)
    [HttpPost("{proveedorId:int}/telefonos")]
    public async Task<ActionResult<int>> Create(int proveedorId, [FromBody] ProveedorTelefonoCreateDTO dto, CancellationToken ct)
    {
        var newId = await _service.CreateAsync(proveedorId, dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = newId }, newId);
    }

    // Modificar teléfono (PUT)
    [HttpPut("telefonos/{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] ProveedorTelefonoUpdateDTO dto, CancellationToken ct)
    {
        await _service.UpdateAsync(id, dto, ct);
        return NoContent();
    }
}