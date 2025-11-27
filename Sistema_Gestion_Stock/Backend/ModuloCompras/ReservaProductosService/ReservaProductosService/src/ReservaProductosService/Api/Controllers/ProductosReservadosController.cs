using Microsoft.AspNetCore.Mvc;
using ReservaProductosService.Application.DTOs;
using ReservaProductosService.Application.Services;

namespace ReservaProductosService.Api.Controllers;

[ApiController]
[Route("api/productos-reservados")]
public class ProductosReservadosController : ControllerBase
{
    private readonly IProductosReservadosService _service;

    public ProductosReservadosController(IProductosReservadosService service)
    {
        _service = service;
    }

    // POST crear reserva de producto
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ProductoReservadoCreateDto dto)
    {
        var result = await _service.CreateAsync(dto);
        return Created($"/api/productos-reservados/{result.Data}", new { id = result.Data });
    }

    // GET listar (puede traer activos, inactivos o todos)
    // /api/productos-reservados?estado=activos|inactivos|todos
    [HttpGet]
    public async Task<IActionResult> List([FromQuery] string? estado = "activos")
    {
        var result = await _service.ListAsync(estado);
        if (!result.Success)
            return BadRequest(new { result.Error });

        return Ok(result.Data);
    }

    // GET por id (trae aunque esté inactivo)
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);
        return result.Success ? Ok(result.Data) : NotFound(new { result.Error });
    }

    // PUT actualizar (reemplaza campos enviados, omite nulls)
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] ProductoReservadoUpdateDto dto)
    {
        var result = await _service.UpdateAsync(id, dto);
        return result.Success ? NoContent() : NotFound(new { result.Error });
    }

    // PATCH cancelar (soft delete -> Activo = 0)
    [HttpPatch("{id:int}/cancelar")]
    public async Task<IActionResult> Cancel(int id)
    {
        var result = await _service.CancelAsync(id);
        return result.Success ? NoContent() : NotFound(new { result.Error });
    }
}