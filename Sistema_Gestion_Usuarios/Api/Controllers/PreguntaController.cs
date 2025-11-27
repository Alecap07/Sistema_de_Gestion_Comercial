using Application.Services;
using Common;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PreguntaController : ControllerBase
    {
        private readonly PreguntaService _service;

        public PreguntaController(PreguntaService service)
        {
            _service = service;
        }

        // 🔹 Obtener todas las preguntas (con búsqueda opcional)
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] string? busqueda)
        {
            var preguntas = await _service.ObtenerTodasAsync(busqueda);
            return Ok(preguntas);
        }

        // 🔹 Obtener pregunta por Id
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var pregunta = await _service.ObtenerPorIdAsync(id);
            if (pregunta == null) return NotFound();
            return Ok(pregunta);
        }

        // 🔹 Obtener preguntas aleatorias activas
        [HttpGet("random/{cantidad}")]
        public async Task<IActionResult> GetRandom(int cantidad)
        {
            var preguntas = await _service.ObtenerRandomAsync(cantidad);
            return Ok(preguntas);
        }

        // 🔹 Crear nueva pregunta
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] PreguntaDto dto)
        {
            var id = await _service.CrearAsync(dto);
            return CreatedAtAction(nameof(Get), new { id }, dto);
        }

        // 🔹 Actualizar pregunta existente
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] PreguntaDto dto)
        {
            if (id != dto.Id) return BadRequest();
            await _service.ActualizarAsync(dto);
            return NoContent();
        }
    }
}
