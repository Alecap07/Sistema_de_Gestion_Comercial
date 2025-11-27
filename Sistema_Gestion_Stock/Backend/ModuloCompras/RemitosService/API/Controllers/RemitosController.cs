using Microsoft.AspNetCore.Mvc;
using RemitosService.Application.DTOs;
using RemitosService.Application.Interfaces;
using RemitosService.Common.Enums;

namespace RemitosService.API.Controllers;

[ApiController]
[Route("api/remitos")]
public class RemitosController : ControllerBase
{
    private readonly IRemitoService _service;
    public RemitosController(IRemitoService service) => _service = service;

    [HttpGet("{id:int}")]
    public async Task<ActionResult<RemitoDTO>> GetById(int id, CancellationToken ct = default)
    {
        var remito = await _service.GetByIdAsync(id, ct);
        return remito == null ? NotFound() : Ok(remito);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<RemitoDTO>>> Search(
        [FromQuery] int? proveedorId,
        [FromQuery] int? ordenCompraId,
        [FromQuery] DateTime? fechaDesde,
        [FromQuery] DateTime? fechaHasta,
        [FromQuery] EstadoFiltro estadoFiltro = EstadoFiltro.Activos,
        CancellationToken ct = default)
    {
        var result = await _service.SearchAsync(proveedorId, ordenCompraId, fechaDesde, fechaHasta, estadoFiltro, ct);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<int>> Create([FromBody] RemitoCreateDTO dto, CancellationToken ct)
    {
        var newId = await _service.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = newId }, newId);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] RemitoUpdateDTO dto, CancellationToken ct)
    {
        await _service.UpdateAsync(id, dto, ct);
        return NoContent();
    }
}