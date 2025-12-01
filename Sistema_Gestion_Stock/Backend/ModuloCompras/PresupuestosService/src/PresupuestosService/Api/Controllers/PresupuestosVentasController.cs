using Microsoft.AspNetCore.Mvc;
using PresupuestosService.Application.DTOs;
using PresupuestosService.Application.Services;

namespace PresupuestosService.Api.Controllers;

[ApiController]
[Route("api/presupuestos")]
public class PresupuestosVentasController : ControllerBase
{
    private readonly IPresupuestosVentasService _service;

    public PresupuestosVentasController(IPresupuestosVentasService service)
    {
        _service = service;
    }


    [HttpPost]
    public async Task<IActionResult> Create([FromBody] PresupuestoVentaCreateDto dto)
    {
        var r = await _service.CreateAsync(dto);
        return Created($"/api/presupuestos/{r.Data}", new { id = r.Data });
    }


    [HttpGet]
    public async Task<IActionResult> List([FromQuery] bool includeInactive = false)
    {
        var r = await _service.ListAsync(includeInactive);
        return Ok(r.Data);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var r = await _service.GetByIdAsync(id);
        return r.Success ? Ok(r.Data) : NotFound(new { r.Error });
    }


    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] PresupuestoVentaUpdateDto dto)
    {
        var r = await _service.UpdateAsync(id, dto);
        return r.Success ? NoContent() : NotFound(new { r.Error });
    }


    [HttpPatch("{id:int}/cancelar")]
    public async Task<IActionResult> Cancel(int id)
    {
        var r = await _service.CancelAsync(id);
        return r.Success ? NoContent() : NotFound(new { r.Error });
    }
}