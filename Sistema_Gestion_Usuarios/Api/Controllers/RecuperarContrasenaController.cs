using Microsoft.AspNetCore.Mvc;
using Application.Services;
using Domain.Dtos;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecuperarContrasenaController : ControllerBase
    {
        private readonly PasswordRecoveryService _service;
        private readonly IConfiguration _config;

        public RecuperarContrasenaController(PasswordRecoveryService service, IConfiguration config)
        {
            _service = service;
            _config = config;
        }

        // 1️⃣ Solicitar recuperación
        [HttpPost("solicitar")]
        public async Task<IActionResult> Solicitar([FromBody] SolicitarRecuperacionDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Nombre_Usuario))
                return BadRequest("Debe ingresar un nombre de usuario o email.");

            var frontend = _config["Frontend:BaseUrl"] ?? "http://localhost:3000";
            await _service.SolicitarRecuperacionAsync(dto.Nombre_Usuario, frontend);
            return Ok("Si existe una cuenta asociada, se envió un correo con instrucciones.");
        }

        // 2️⃣ Obtener preguntas de seguridad
        [HttpGet("preguntas")]
        public async Task<IActionResult> Preguntas([FromQuery] string token)
        {
            if (string.IsNullOrWhiteSpace(token))
                return BadRequest("Token requerido.");

            var preguntas = await _service.ObtenerPreguntasAsync(token);
            if (preguntas == null || preguntas.Count == 0)
                return BadRequest("Token inválido o expirado.");

            return Ok(preguntas);
        }

        // 3️⃣ Validar respuestas de seguridad
        [HttpPost("validar-respuestas")]
        public async Task<IActionResult> ValidarRespuestas([FromBody] ValidarRespuestasRecuperacionDto dto)
        {
            if (dto == null || dto.Respuestas.Count == 0 || string.IsNullOrWhiteSpace(dto.Token))
                return BadRequest("Datos incompletos.");

            var esValido = await _service.ValidarRespuestasAsync(dto);
            if (!esValido)
                return BadRequest("Respuestas incorrectas o token inválido.");

            return Ok("Respuestas correctas.");
        }

        // 4️⃣ Cambiar contraseña
        [HttpPost("cambiar")]
        public async Task<IActionResult> Cambiar([FromBody] CambiarContrasenaRecuperacionDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Token) || string.IsNullOrWhiteSpace(dto.NuevaContraseña))
                return BadRequest("Datos incompletos.");

            var result = await _service.CambiarContrasenaAsync(dto.Token, dto.NuevaContraseña);
            if (!result)
                return BadRequest("El token es inválido o ha expirado.");

            return Ok("Contraseña actualizada correctamente.");
        }
    }
}
