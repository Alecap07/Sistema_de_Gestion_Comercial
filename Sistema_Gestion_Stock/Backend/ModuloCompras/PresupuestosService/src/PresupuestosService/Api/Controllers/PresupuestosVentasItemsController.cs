using Microsoft.AspNetCore.Mvc;
using PresupuestosService.Application.DTOs;
using PresupuestosService.Application.Services;

namespace PresupuestosService.Api.Controllers;

[ApiController]
[Route("api/presupuestos/items")]
public class PresupuestosVentasItemsController : ControllerBase
{
    private readonly IPresupuestosVentasItemsService _service;

    public PresupuestosVentasItemsController(IPresupuestosVentasItemsService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] PresupuestoVentaItemCreateDto dto)
    {
        var r = await _service.CreateAsync(dto);
        return Created($"/api/presupuestos/items/{r.Data}", new { id = r.Data });
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var r = await _service.GetByIdAsync(id);
        return r.Success ? Ok(r.Data) : NotFound(new { r.Error });
    }

    [HttpGet("/api/presupuestos/{presupuestoId:int}/items")]
    public async Task<IActionResult> ListByPresupuesto(int presupuestoId)
    {
        var r = await _service.ListByPresupuestoAsync(presupuestoId);
        return Ok(r.Data);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] PresupuestoVentaItemUpdateDto dto)
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