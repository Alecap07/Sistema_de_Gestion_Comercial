// placeholder
using Microsoft.AspNetCore.Mvc;
using FacturasService.Application.DTOs;
using FacturasService.Application.Interfaces;
using FacturasService.Common.Enums;

namespace FacturasService.API.Controllers;

[ApiController]
[Route("api/factura-compra-remitos")]
public class FacturaCompraRemitosController : ControllerBase
{
    private readonly IFacturaCompraRemitoService _service;
    public FacturaCompraRemitosController(IFacturaCompraRemitoService service) => _service = service;

    [HttpGet("{id:int}")]
    public async Task<ActionResult<FacturaCompraRemitoDTO>> GetById(int id, CancellationToken ct = default)
    {
        var dto = await _service.GetByIdAsync(id, ct);
        return dto == null ? NotFound() : Ok(dto);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<FacturaCompraRemitoDTO>>> Search(
        [FromQuery] int? facturaId,
        [FromQuery] int? remitoId,
        [FromQuery] EstadoFiltro estadoFiltro = EstadoFiltro.Activos,
        CancellationToken ct = default)
    {
        var result = await _service.SearchAsync(facturaId, remitoId, estadoFiltro, ct);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<int>> Create([FromBody] FacturaCompraRemitoCreateDTO dto, CancellationToken ct)
    {
        var newId = await _service.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = newId }, newId);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] FacturaCompraRemitoUpdateDTO dto, CancellationToken ct)
    {
        await _service.UpdateAsync(id, dto, ct);
        return NoContent();
    }
}