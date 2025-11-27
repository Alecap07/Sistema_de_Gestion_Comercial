using Microsoft.AspNetCore.Mvc;
using ComprasService.Application.DTOs;
using ComprasService.Application.Interfaces;
using ComprasService.Common.Enums;

namespace ComprasService.API.Controllers;

[ApiController]
[Route("api/orden-compra-items")]
public class OrdenCompraItemsController : ControllerBase
{
    private readonly IOrdenCompraItemService _service;
    public OrdenCompraItemsController(IOrdenCompraItemService service) => _service = service;

    [HttpGet("{id:int}")]
    public async Task<ActionResult<OrdenCompraItemDTO>> GetById(int id, CancellationToken ct = default)
    {
        var item = await _service.GetByIdAsync(id, ct);
        return item == null ? NotFound() : Ok(item);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<OrdenCompraItemDTO>>> Search(
        [FromQuery] int? ordenCompraId,
        [FromQuery] EstadoFiltro estadoFiltro = EstadoFiltro.Activos,
        CancellationToken ct = default)
    {
        var result = await _service.SearchAsync(ordenCompraId, estadoFiltro, ct);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<int>> Create([FromBody] OrdenCompraItemCreateDTO dto, CancellationToken ct)
    {
        var newId = await _service.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = newId }, newId);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] OrdenCompraItemUpdateDTO dto, CancellationToken ct)
    {
        await _service.UpdateAsync(id, dto, ct);
        return NoContent();
    }
}