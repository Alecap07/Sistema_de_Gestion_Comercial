using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Application.Services;
using Common;
using Domain.Entities;
using Common.Mappers;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RespuestasController : ControllerBase
    {
        private readonly RespuestaService _service;

        public RespuestasController(RespuestaService service)
        {
            _service = service;
        }

        // 🔹 Guardar nuevas respuestas (POST /api/respuestas)
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> GuardarRespuestas([FromBody] List<RespuestaDto> respuestas)
        {
            int usuarioId = int.Parse(User.FindFirst("id")?.Value ?? "0");

            foreach (var dto in respuestas)
            {
                dto.Id_User = usuarioId;
                await _service.GuardarRespuestaAsync(dto);
            }

            return Ok("Respuestas guardadas correctamente");
        }

        // 🔹 Obtener todas las preguntas y respuestas del usuario (GET /api/respuestas)
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> ObtenerPreguntasYRespuestas()
        {
            int usuarioId = int.Parse(User.FindFirst("id")?.Value ?? "0");

            var result = await _service.ObtenerPreguntasYRespuestasPorUsuarioAsync(usuarioId);

            return Ok(result);
        }

        // 🔹 Actualizar todas las respuestas del usuario de manera masiva (PUT /api/respuestas/masivo)
        [Authorize]
        [HttpPut("masivo")]
        public async Task<IActionResult> ActualizarRespuestasMasivas([FromBody] List<PreguntaRespuestaDto> respuestas)
        {
            if (respuestas == null || respuestas.Count == 0)
                return BadRequest("No se recibieron respuestas para actualizar.");

            int usuarioId = int.Parse(User.FindFirst("id")?.Value ?? "0");

            bool allUpdated = true;
            foreach (var dto in respuestas)
            {
                bool updated = await _service.ActualizarRespuestaAsync(usuarioId, dto);
                if (!updated) allUpdated = false;
            }

            if (!allUpdated)
                return StatusCode(500, "Algunas respuestas no pudieron actualizarse.");

            return Ok("Respuestas actualizadas correctamente.");
        }

        // 🔹 Actualizar una respuesta específica (PUT /api/respuestas/{idPregunta})
        [Authorize]
        [HttpPut("{idPregunta}")]
        public async Task<IActionResult> ActualizarRespuesta(int idPregunta, [FromBody] PreguntaRespuestaDto dto)
        {
            int usuarioId = int.Parse(User.FindFirst("id")?.Value ?? "0");

            dto.Id_Pregun = idPregunta; // aseguramos que la pregunta corresponda al endpoint
            bool actualizado = await _service.ActualizarRespuestaAsync(usuarioId, dto);

            if (!actualizado)
                return NotFound("No se encontró la respuesta para actualizar.");

            return Ok("Respuesta actualizada correctamente");
        }
    }
}
