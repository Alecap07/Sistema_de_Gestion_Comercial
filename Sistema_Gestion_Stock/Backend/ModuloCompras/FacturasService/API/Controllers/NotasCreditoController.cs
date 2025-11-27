// placeholder
using Microsoft.AspNetCore.Mvc;
using FacturasService.Application.DTOs;
using FacturasService.Application.Interfaces;
using FacturasService.Common.Enums;

namespace FacturasService.API.Controllers;

[ApiController]
[Route("api/notas-credito")]
public class NotasCreditoController : ControllerBase
{
    private readonly INotaCreditoService _service;
    public NotasCreditoController(INotaCreditoService service) => _service = service;

    [HttpGet("{id:int}")]
    public async Task<ActionResult<NotaCreditoDTO>> GetById(int id, CancellationToken ct = default)
    {
        var dto = await _service.GetByIdAsync(id, ct);
        return dto == null ? NotFound() : Ok(dto);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<NotaCreditoDTO>>> Search(
        [FromQuery] int? proveedorId,
        [FromQuery] int? facturaId,
        [FromQuery] DateTime? fechaDesde,
        [FromQuery] DateTime? fechaHasta,
        [FromQuery] EstadoFiltro estadoFiltro = EstadoFiltro.Activos,
        CancellationToken ct = default)
    {
        var result = await _service.SearchAsync(proveedorId, facturaId, fechaDesde, fechaHasta, estadoFiltro, ct);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<int>> Create([FromBody] NotaCreditoCreateDTO dto, CancellationToken ct)
    {
        var newId = await _service.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = newId }, newId);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] NotaCreditoUpdateDTO dto, CancellationToken ct)
    {
        await _service.UpdateAsync(id, dto, ct);
        return NoContent();
    }
}