using Microsoft.AspNetCore.Mvc;
using NotasCreditoService.Application.DTOs;
using NotasCreditoService.Application.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NotasCreditoService.Api.Controllers
{
    [ApiController]
    [Route("api/notas-credito")]
    public class NotasCreditoVentasController : ControllerBase
    {
        private readonly INotasCreditoVentasService _service;

        public NotasCreditoVentasController(INotasCreditoVentasService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] NotaCreditoVentaCreateDTO dto)
        {
            var id = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id }, new { id });
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<NotaCreditoVentaReadDTO>> GetById(int id)
        {
            var res = await _service.GetByIdAsync(id);
            return res == null ? NotFound() : Ok(res);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<NotaCreditoVentaReadDTO>>> List()
        {
            var res = await _service.ListAsync();
            return Ok(res);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] NotaCreditoVentaUpdateDTO dto)
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
