using Microsoft.AspNetCore.Mvc;
using ComprasService.Application.DTOs;
using ComprasService.Application.Interfaces;
using ComprasService.Common.Enums;

namespace ComprasService.API.Controllers;

[ApiController]
[Route("api/presupuesto-items")]
public class PresupuestoItemsController : ControllerBase
{
    private readonly IPresupuestoItemService _service;
    public PresupuestoItemsController(IPresupuestoItemService service) => _service = service;

    [HttpGet("{id:int}")]
    public async Task<ActionResult<PresupuestoItemDTO>> GetById(int id, CancellationToken ct = default)
    {
        var item = await _service.GetByIdAsync(id, ct);
        return item == null ? NotFound() : Ok(item);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PresupuestoItemDTO>>> Search(
        [FromQuery] int? presupuestoId,
        [FromQuery] EstadoFiltro estadoFiltro = EstadoFiltro.Activos,
        CancellationToken ct = default)
    {
        var result = await _service.SearchAsync(presupuestoId, estadoFiltro, ct);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<int>> Create([FromBody] PresupuestoItemCreateDTO dto, CancellationToken ct)
    {
        var newId = await _service.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = newId }, newId);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] PresupuestoItemUpdateDTO dto, CancellationToken ct)
    {
        await _service.UpdateAsync(id, dto, ct);
        return NoContent();
    }
}