// placeholder
using Microsoft.AspNetCore.Mvc;
using FacturasService.Application.DTOs;
using FacturasService.Application.Interfaces;
using FacturasService.Common.Enums;

namespace FacturasService.API.Controllers;

[ApiController]
[Route("api/facturas-compra")]
public class FacturasCompraController : ControllerBase
{
    private readonly IFacturaCompraService _service;
    public FacturasCompraController(IFacturaCompraService service) => _service = service;

    [HttpGet("{id:int}")]
    public async Task<ActionResult<FacturaCompraDTO>> GetById(int id, CancellationToken ct = default)
    {
        var factura = await _service.GetByIdAsync(id, ct);
        return factura == null ? NotFound() : Ok(factura);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<FacturaCompraDTO>>> Search(
        [FromQuery] int? proveedorId,
        [FromQuery] string? numeroFactura,
        [FromQuery] DateTime? fechaDesde,
        [FromQuery] DateTime? fechaHasta,
        [FromQuery] EstadoFiltro estadoFiltro = EstadoFiltro.Activos,
        CancellationToken ct = default)
    {
        var result = await _service.SearchAsync(proveedorId, numeroFactura, fechaDesde, fechaHasta, estadoFiltro, ct);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<int>> Create([FromBody] FacturaCompraCreateDTO dto, CancellationToken ct)
    {
        var newId = await _service.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = newId }, newId);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] FacturaCompraUpdateDTO dto, CancellationToken ct)
    {
        await _service.UpdateAsync(id, dto, ct);
        return NoContent();
    }
}