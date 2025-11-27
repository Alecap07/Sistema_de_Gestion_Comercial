using Microsoft.AspNetCore.Mvc;
using RemitosService.Application.DTOs;
using RemitosService.Application.Interfaces;
using RemitosService.Common.Enums;

namespace RemitosService.API.Controllers;

[ApiController]
[Route("api/devolucion-items")]
public class DevolucionItemsController : ControllerBase
{
    private readonly IDevolucionItemService _service;
    public DevolucionItemsController(IDevolucionItemService service) => _service = service;

    [HttpGet("{id:int}")]
    public async Task<ActionResult<DevolucionItemDTO>> GetById(int id, CancellationToken ct = default)
    {
        var item = await _service.GetByIdAsync(id, ct);
        return item == null ? NotFound() : Ok(item);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<DevolucionItemDTO>>> Search(
        [FromQuery] int? devolucionId,
        [FromQuery] EstadoFiltro estadoFiltro = EstadoFiltro.Activos,
        CancellationToken ct = default)
    {
        var result = await _service.SearchAsync(devolucionId, estadoFiltro, ct);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<int>> Create([FromBody] DevolucionItemCreateDTO dto, CancellationToken ct)
    {
        var newId = await _service.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = newId }, newId);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] DevolucionItemUpdateDTO dto, CancellationToken ct)
    {
        await _service.UpdateAsync(id, dto, ct);
        return NoContent();
    }
}