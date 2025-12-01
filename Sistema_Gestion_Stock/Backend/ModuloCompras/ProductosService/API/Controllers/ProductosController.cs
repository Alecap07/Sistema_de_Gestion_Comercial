using Microsoft.AspNetCore.Mvc;
using ProductosService.Application.DTOs;
using ProductosService.Application.Interfaces;
using ProductosService.Common.Enums;

namespace ProductosService.API.Controllers;

[ApiController]
[Route("api/productos")]
public sealed class ProductosController : ControllerBase
{
    private readonly IProductoService _service;
    public ProductosController(IProductoService service) => _service = service;

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductoDTO>> GetById(int id, CancellationToken ct)
    {
        var item = await _service.GetByIdAsync(id, ct);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpGet("codigo/{codigo}")]
    public async Task<ActionResult<ProductoDTO>> GetByCodigo(string codigo, CancellationToken ct)
    {
        var item = await _service.GetByCodigoAsync(codigo, ct);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductoDTO>>> Search(
        [FromQuery] string? nombre,
        [FromQuery] int? categoriaId,
        [FromQuery] int? marcaId,
        [FromQuery] EstadoFiltro estado = EstadoFiltro.Activos,
        CancellationToken ct = default)
        => Ok(await _service.SearchAsync(nombre, categoriaId, marcaId, estado, ct));

    [HttpPost]
    public async Task<ActionResult<int>> Create([FromBody] ProductoCreateDTO dto, CancellationToken ct)
    {
        var newId = await _service.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = newId }, newId);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] ProductoUpdateDTO dto, CancellationToken ct)
    {
        await _service.UpdateAsync(id, dto, ct);
        return NoContent();
    }

    [HttpPost("{id:int}/stock/ajustar")]
    public async Task<ActionResult<object>> AdjustStock(int id, [FromQuery] int delta, CancellationToken ct)
    {
        var newStock = await _service.AdjustStockDeltaAsync(id, delta, ct);
        return Ok(new { productoId = id, newStock });
    }
}