// placeholder
using Microsoft.AspNetCore.Mvc;
using FacturasService.Application.DTOs;
using FacturasService.Application.Interfaces;
using FacturasService.Common.Enums;

namespace FacturasService.API.Controllers;

[ApiController]
[Route("api/factura-compra-items")]
public class FacturaCompraItemsController : ControllerBase
{
    private readonly IFacturaCompraItemService _service;
    public FacturaCompraItemsController(IFacturaCompraItemService service) => _service = service;

    [HttpGet("{id:int}")]
    public async Task<ActionResult<FacturaCompraItemDTO>> GetById(int id, CancellationToken ct = default)
    {
        var item = await _service.GetByIdAsync(id, ct);
        return item == null ? NotFound() : Ok(item);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<FacturaCompraItemDTO>>> Search(
        [FromQuery] int? facturaId,
        [FromQuery] EstadoFiltro estadoFiltro = EstadoFiltro.Activos,
        CancellationToken ct = default)
    {
        var result = await _service.SearchAsync(facturaId, estadoFiltro, ct);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<int>> Create([FromBody] FacturaCompraItemCreateDTO dto, CancellationToken ct)
    {
        var newId = await _service.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = newId }, newId);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] FacturaCompraItemUpdateDTO dto, CancellationToken ct)
    {
        await _service.UpdateAsync(id, dto, ct);
        return NoContent();
    }
}