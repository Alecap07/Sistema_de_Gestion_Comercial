// placeholder
using Microsoft.AspNetCore.Mvc;
using FacturasService.Application.DTOs;
using FacturasService.Application.Interfaces;
using FacturasService.Common.Enums;

namespace FacturasService.API.Controllers;

[ApiController]
[Route("api/notas-debito")]
public class NotasDebitoController : ControllerBase
{
    private readonly INotaDebitoService _service;
    public NotasDebitoController(INotaDebitoService service) => _service = service;

    [HttpGet("{id:int}")]
    public async Task<ActionResult<NotaDebitoDTO>> GetById(int id, CancellationToken ct = default)
    {
        var dto = await _service.GetByIdAsync(id, ct);
        return dto == null ? NotFound() : Ok(dto);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<NotaDebitoDTO>>> Search(
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
    public async Task<ActionResult<int>> Create([FromBody] NotaDebitoCreateDTO dto, CancellationToken ct)
    {
        var newId = await _service.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = newId }, newId);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] NotaDebitoUpdateDTO dto, CancellationToken ct)
    {
        await _service.UpdateAsync(id, dto, ct);
        return NoContent();
    }
}