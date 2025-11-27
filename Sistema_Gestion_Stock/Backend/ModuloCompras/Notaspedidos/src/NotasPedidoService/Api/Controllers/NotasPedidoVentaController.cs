using Microsoft.AspNetCore.Mvc;
using NotasPedidoService.Application.DTOs;
using NotasPedidoService.Application.Services;
namespace NotasPedidoService.Api.Controllers

{
    [ApiController]
    [Route("api/notas-pedido")]
    public class NotasPedidoVentaController : ControllerBase
    {
        private readonly INotasPedidoVentaService _service;

        public NotasPedidoVentaController(INotasPedidoVentaService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] NotaPedidoVentaCreateDTO dto)
        {
            var id = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id }, new { id });
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<NotaPedidoVentaReadDTO>> GetById(int id)
        {
            var res = await _service.GetByIdAsync(id);
            return res == null ? NotFound() : Ok(res);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<NotaPedidoVentaReadDTO>>> List([FromQuery] bool includeInactive = false)
        {
            var res = await _service.ListAsync(includeInactive);
            return Ok(res);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] NotaPedidoVentaUpdateDTO dto)
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
