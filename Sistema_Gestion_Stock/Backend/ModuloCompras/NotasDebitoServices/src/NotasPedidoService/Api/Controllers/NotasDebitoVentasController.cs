using Microsoft.AspNetCore.Mvc;
using NotasDebitoService.Application.DTOs;
using NotasDebitoService.Application.Services;

namespace NotasDebitoService.Api.Controllers
{
    [ApiController]
    [Route("api/notas-debito")]
    public class NotasDebitoVentasController : ControllerBase
    {
        private readonly INotasDebitoVentasService _service;

        public NotasDebitoVentasController(INotasDebitoVentasService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] NotaDebitoVentaCreateDTO dto)
        {
            var id = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id }, new { id });
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<NotaDebitoVentaReadDTO>> GetById(int id)
        {
            var res = await _service.GetByIdAsync(id);
            return res == null ? NotFound() : Ok(res);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<NotaDebitoVentaReadDTO>>> List([FromQuery] bool includeInactive = false)
        {
            var res = await _service.ListAsync(includeInactive);
            return Ok(res);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] NotaDebitoVentaUpdateDTO dto)
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
