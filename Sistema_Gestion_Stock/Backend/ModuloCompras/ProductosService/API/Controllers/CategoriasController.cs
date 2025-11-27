using Microsoft.AspNetCore.Mvc;
using ProductosService.Application.DTOs;
using ProductosService.Application.Interfaces;
using ProductosService.Common.Enums;

namespace ProductosService.API.Controllers;

[ApiController]
[Route("api/categorias")]
public sealed class CategoriasController : ControllerBase
{
    private readonly ICategoriaService _service;
    public CategoriasController(ICategoriaService service) => _service = service;

    [HttpGet("{id:int}")]
    public async Task<ActionResult<CategoriaDTO>> GetById(int id, CancellationToken ct)
    {
        var item = await _service.GetByIdAsync(id, ct);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoriaDTO>>> GetAll([FromQuery] EstadoFiltro estado = EstadoFiltro.Activos, CancellationToken ct = default)
        => Ok(await _service.GetAllAsync(estado, ct));

    [HttpPost]
    public async Task<ActionResult<int>> Create([FromBody] CategoriaCreateDTO dto, CancellationToken ct)
    {
        var newId = await _service.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = newId }, newId);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] CategoriaUpdateDTO dto, CancellationToken ct)
    {
        await _service.UpdateAsync(id, dto, ct);
        return NoContent();
    }
}