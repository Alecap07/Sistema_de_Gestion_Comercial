using Microsoft.AspNetCore.Mvc;
using ProveedoresService.Application.DTOs;
using ProveedoresService.Application.Interfaces;
using ProveedoresService.Common.Enums;

namespace ProveedoresService.API.Controllers;

[ApiController]
[Route("api/proveedores")]
public class ProveedorCategoriasController : ControllerBase
{
    private readonly IProveedorCategoriaService _service;
    public ProveedorCategoriasController(IProveedorCategoriaService service) => _service = service;

    // Listar categorías de un proveedor
    [HttpGet("{proveedorId:int}/categorias")]
    public async Task<ActionResult<IEnumerable<ProveedorCategoriaDTO>>> GetByProveedor(int proveedorId, [FromQuery] EstadoFiltro estado = EstadoFiltro.Activos, CancellationToken ct = default)
    {
        var lista = await _service.GetByProveedorAsync(proveedorId, estado, ct);
        return Ok(lista);
    }

    // Obtener asociación individual por ID
    [HttpGet("categorias/{id:int}")]
    public async Task<ActionResult<ProveedorCategoriaDTO>> GetById(int id, CancellationToken ct = default)
    {
        var obj = await _service.GetByIdAsync(id, ct);
        return obj == null ? NotFound() : Ok(obj);
    }

    // Crear categoría (asociar proveedor a categoría)
    [HttpPost("{proveedorId:int}/categorias")]
    public async Task<ActionResult<int>> Create(int proveedorId, [FromBody] ProveedorCategoriaCreateDTO dto, CancellationToken ct)
    {
        var newId = await _service.CreateAsync(proveedorId, dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = newId }, newId);
    }

    // Modificar asociación (cambiar categoría, activar/desactivar)
    [HttpPut("categorias/{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] ProveedorCategoriaUpdateDTO dto, CancellationToken ct)
    {
        await _service.UpdateAsync(id, dto, ct);
        return NoContent();
    }
}