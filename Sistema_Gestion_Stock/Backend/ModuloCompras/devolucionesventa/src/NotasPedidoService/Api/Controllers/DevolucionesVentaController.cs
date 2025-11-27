using Microsoft.AspNetCore.Mvc;
using DevolucionesService.Application.DTOs;
using DevolucionesService.Application.Services;

namespace DevolucionesService.Api.Controllers
{
    [ApiController]
    [Route("api/devoluciones")]
    public class DevolucionesVentaController : ControllerBase
    {
        private readonly IDevolucionesVentaService _service;

        public DevolucionesVentaController(IDevolucionesVentaService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] DevolucionVentaCreateDTO dto)
        {
            var id = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id }, new { id });
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<DevolucionVentaReadDTO>> GetById(int id)
        {
            var res = await _service.GetByIdAsync(id);
            return res == null ? NotFound() : Ok(res);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DevolucionVentaReadDTO>>> List([FromQuery] bool includeInactive = false)
        {
            var res = await _service.ListAsync(includeInactive);
            return Ok(res);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] DevolucionVentaUpdateDTO dto)
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
