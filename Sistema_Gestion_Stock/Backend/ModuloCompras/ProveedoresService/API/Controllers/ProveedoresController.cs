using Microsoft.AspNetCore.Mvc;
using ProveedoresService.Application.DTOs;
using ProveedoresService.Application.Interfaces;
using ProveedoresService.Common.Enums;

namespace ProveedoresService.API.Controllers;

[ApiController]
[Route("api/proveedores")]
public class ProveedoresController : ControllerBase
{
    private readonly IProveedorService _service;
    public ProveedoresController(IProveedorService service) => _service = service;

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProveedorDTO>> GetById(int id, CancellationToken ct)
    {
        var proveedor = await _service.GetByIdAsync(id, ct);
        return proveedor == null ? NotFound() : Ok(proveedor);
    }

    [HttpGet("por-codigo/{codigo}")]
    public async Task<ActionResult<ProveedorDTO>> GetByCodigo(string codigo, CancellationToken ct)
    {
        var proveedor = await _service.GetByCodigoAsync(codigo, ct);
        return proveedor == null ? NotFound() : Ok(proveedor);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProveedorDTO>>> Search(
        [FromQuery] string? razonSocial,
        [FromQuery] string? codigo,
        [FromQuery] int? personaId,
        [FromQuery] EstadoFiltro estado = EstadoFiltro.Activos,
        CancellationToken ct = default)
    {
        var result = await _service.SearchAsync(razonSocial, codigo, personaId, estado, ct);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<int>> Create([FromBody] ProveedorCreateDTO dto, CancellationToken ct)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var newId = await _service.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = newId }, newId);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] ProveedorUpdateDTO dto, CancellationToken ct)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        await _service.UpdateAsync(id, dto, ct);
        return NoContent();
    }
}