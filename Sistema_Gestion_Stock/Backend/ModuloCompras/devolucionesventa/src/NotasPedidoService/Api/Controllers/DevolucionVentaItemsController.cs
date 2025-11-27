using Microsoft.AspNetCore.Mvc;
using DevolucionesService.Application.DTOs;
using DevolucionesService.Application.Services;

namespace DevolucionesService.Api.Controllers
{
    [ApiController]
    [Route("api/devoluciones/items")]
    public class DevolucionVentaItemsController : ControllerBase
    {
        private readonly IDevolucionVentaItemsService _service;

        public DevolucionVentaItemsController(IDevolucionVentaItemsService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] DevolucionVentaItemCreateDTO dto)
        {
            var id = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id }, new { id });
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<DevolucionVentaItemReadDTO>> GetById(int id)
        {
            var res = await _service.GetByIdAsync(id);
            return res == null ? NotFound() : Ok(res);
        }

        [HttpGet("by-devolucion/{devolucionId:int}")]
        public async Task<ActionResult<IEnumerable<DevolucionVentaItemReadDTO>>> ListByDevolucion(int devolucionId, [FromQuery] bool includeInactive = false)
        {
            var res = await _service.ListByDevolucionAsync(devolucionId, includeInactive);
            return Ok(res);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] DevolucionVentaItemUpdateDTO dto)
        {
            await _service.UpdateAsync(id, dto);
            return NoContent();
        }

        [HttpPatch("{id:int}/cancelar")]
        public async Task<IActionResult> Cancel(int id)
        {
            await _service.CancelAsync(id);
            return NoContent();
        }
    }
}
