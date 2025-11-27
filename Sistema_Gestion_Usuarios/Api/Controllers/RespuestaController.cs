using Application.Services;
using Common;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]/respuesta")]
    public class RespuestaController : ControllerBase
    {
        private readonly RespuestaService _respuestaService;
        public RespuestaController(RespuestaService respuestaService)
        {
            _respuestaService = respuestaService;
        }


        [HttpPost]
        public async Task<IActionResult> Post([FromBody] RespuestaDto dto)
        {
            var result = await _respuestaService.GuardarRespuestaAsync(dto);
            if (result)
                return Ok();
            return BadRequest();
        }


        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();
            var preguntasRespuestas = await _respuestaService.ObtenerPreguntasYRespuestasPorUsuarioAsync(userId.Value);
            return Ok(preguntasRespuestas);
        }


        [HttpPut]
        public async Task<IActionResult> Put([FromBody] PreguntaRespuestaDto dto)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();
            var result = await _respuestaService.ActualizarRespuestaAsync(userId.Value, dto);
            if (result)
                return Ok();
            return BadRequest();
        }

        // Método privado para obtener el id del usuario autenticado
        private int? GetUserId()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return null;
            if (!int.TryParse(userIdClaim.Value, out int userId)) return null;
            return userId;
        }
    }
}
