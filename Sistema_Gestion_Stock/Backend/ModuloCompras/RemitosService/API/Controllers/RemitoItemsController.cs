using Microsoft.AspNetCore.Mvc;
using RemitosService.Application.DTOs;
using RemitosService.Application.Interfaces;
using RemitosService.Common.Enums;

namespace RemitosService.API.Controllers;

[ApiController]
[Route("api/remito-items")]
public class RemitoItemsController : ControllerBase
{
    private readonly IRemitoItemService _service;
    public RemitoItemsController(IRemitoItemService service) => _service = service;

    [HttpGet("{id:int}")]
    public async Task<ActionResult<RemitoItemDTO>> GetById(int id, CancellationToken ct = default)
    {
        var item = await _service.GetByIdAsync(id, ct);
        return item == null ? NotFound() : Ok(item);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<RemitoItemDTO>>> Search(
        [FromQuery] int? remitoId,
        [FromQuery] EstadoFiltro estadoFiltro = EstadoFiltro.Activos,
        CancellationToken ct = default)
    {
        var result = await _service.SearchAsync(remitoId, estadoFiltro, ct);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<int>> Create([FromBody] RemitoItemCreateDTO dto, CancellationToken ct)
    {
        var newId = await _service.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = newId }, newId);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] RemitoItemUpdateDTO dto, CancellationToken ct)
    {
        await _service.UpdateAsync(id, dto, ct);
        return NoContent();
    }
}