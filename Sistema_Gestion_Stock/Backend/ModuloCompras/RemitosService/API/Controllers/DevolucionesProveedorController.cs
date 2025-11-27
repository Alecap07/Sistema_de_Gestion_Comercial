using Microsoft.AspNetCore.Mvc;
using RemitosService.Application.DTOs;
using RemitosService.Application.Interfaces;
using RemitosService.Common.Enums;

namespace RemitosService.API.Controllers;

[ApiController]
[Route("api/devoluciones-proveedor")]
public class DevolucionesProveedorController : ControllerBase
{
    private readonly IDevolucionProveedorService _service;
    public DevolucionesProveedorController(IDevolucionProveedorService service) => _service = service;

    [HttpGet("{id:int}")]
    public async Task<ActionResult<DevolucionProveedorDTO>> GetById(int id, CancellationToken ct = default)
    {
        var dto = await _service.GetByIdAsync(id, ct);
        return dto == null ? NotFound() : Ok(dto);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<DevolucionProveedorDTO>>> Search(
        [FromQuery] int? proveedorId,
        [FromQuery] DateTime? fechaDesde,
        [FromQuery] DateTime? fechaHasta,
        [FromQuery] EstadoFiltro estadoFiltro = EstadoFiltro.Activos,
        CancellationToken ct = default)
    {
        var result = await _service.SearchAsync(proveedorId, fechaDesde, fechaHasta, estadoFiltro, ct);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<int>> Create([FromBody] DevolucionProveedorCreateDTO dto, CancellationToken ct)
    {
        var newId = await _service.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = newId }, newId);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] DevolucionProveedorUpdateDTO dto, CancellationToken ct)
    {
        await _service.UpdateAsync(id, dto, ct);
        return NoContent();
    }
}