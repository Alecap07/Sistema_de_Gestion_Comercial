using Microsoft.AspNetCore.Mvc;
using ComprasService.Application.DTOs;
using ComprasService.Application.Interfaces;
using ComprasService.Common.Enums;

namespace ComprasService.API.Controllers;

[ApiController]
[Route("api/ordenes-compra")]
public class OrdenesCompraController : ControllerBase
{
    private readonly IOrdenCompraService _service;
    public OrdenesCompraController(IOrdenCompraService service) => _service = service;

    [HttpGet("{id:int}")]
    public async Task<ActionResult<OrdenCompraDTO>> GetById(int id, CancellationToken ct = default)
    {
        var orden = await _service.GetByIdAsync(id, ct);
        return orden == null ? NotFound() : Ok(orden);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<OrdenCompraDTO>>> Search(
        [FromQuery] int? proveedorId,
        [FromQuery] string? estado,
        [FromQuery] DateTime? fechaDesde,
        [FromQuery] DateTime? fechaHasta,
        [FromQuery] EstadoFiltro estadoFiltro = EstadoFiltro.Activos,
        CancellationToken ct = default)
    {
        var result = await _service.SearchAsync(proveedorId, estado, fechaDesde, fechaHasta, estadoFiltro, ct);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<int>> Create([FromBody] OrdenCompraCreateDTO dto, CancellationToken ct)
    {
        var newId = await _service.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = newId }, newId);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] OrdenCompraUpdateDTO dto, CancellationToken ct)
    {
        await _service.UpdateAsync(id, dto, ct);
        return NoContent();
    }
}