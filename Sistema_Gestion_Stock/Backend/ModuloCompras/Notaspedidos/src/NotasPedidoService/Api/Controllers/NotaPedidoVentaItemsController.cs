using Microsoft.AspNetCore.Mvc;
using NotasPedidoService.Application.DTOs;
using NotasPedidoService.Application.Services;
namespace NotasPedidoService.Api.Controllers

{
    [ApiController]
    [Route("api/notas-pedido/items")]
    public class NotaPedidoVentaItemsController : ControllerBase
    {
        private readonly INotaPedidoVentaItemsService _service;

        public NotaPedidoVentaItemsController(INotaPedidoVentaItemsService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] NotaPedidoVentaItemCreateDTO dto)
        {
            var id = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id }, new { id });
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<NotaPedidoVentaItemReadDTO>> GetById(int id)
        {
            var res = await _service.GetByIdAsync(id);
            return res == null ? NotFound() : Ok(res);
        }

        [HttpGet("by-nota/{notaId:int}")]
        public async Task<ActionResult<IEnumerable<NotaPedidoVentaItemReadDTO>>> ListByNota(int notaId, [FromQuery] bool includeInactive = false)
        {
            var res = await _service.ListByNotaAsync(notaId, includeInactive);
            return Ok(res);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] NotaPedidoVentaItemUpdateDTO dto)
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
