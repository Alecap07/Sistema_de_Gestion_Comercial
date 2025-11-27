using Common;
using Common.Mappers;
using Domain.Entities;
using Domain.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Services
{

    public class RespuestaService
    {
        private readonly IRespuestaRepository _respuestaRepo;
        private readonly IPreguntaRepository _preguntaRepo;

        public RespuestaService(IRespuestaRepository respuestaRepo, IPreguntaRepository preguntaRepo)
        {
            _respuestaRepo = respuestaRepo;
            _preguntaRepo = preguntaRepo;
        }

        // Obtener todas las preguntas con las respuestas del usuario
        public async Task<List<PreguntaRespuestaDto>> ObtenerPreguntasYRespuestasPorUsuarioAsync(int userId)
        {
            var respuestas = await _respuestaRepo.GetRespuestasByUserAsync(userId);
            var preguntas = await _preguntaRepo.GetAllAsync();

            var result = (from r in respuestas
                          join p in preguntas on r.Id_Pregun equals p.Id
                          select new PreguntaRespuestaDto
                          {
                              Id_Pregun = p.Id,
                              Pregunta = p.Texto,
                              Respuesta = r.Texto ?? "" // ✅ tu cambio
                          }).ToList();

            return result;
        }

        // Actualizar una respuesta específica del usuario
        public async Task<bool> ActualizarRespuestaAsync(int userId, PreguntaRespuestaDto dto)
        {
            var respuestaExistente = await _respuestaRepo.GetRespuestaAsync(userId, dto.Id_Pregun);
            if (respuestaExistente == null) return false;

            respuestaExistente.Texto = dto.Respuesta; // ✅ tu cambio
            var result = await _respuestaRepo.UpdateRespuestaAsync(respuestaExistente);
            return result > 0;
        }

        // Guardar una nueva respuesta
        public async Task<bool> GuardarRespuestaAsync(RespuestaDto dto)
        {
            var entity = RespuestaMapper.ToEntity(dto);
            var result = await _respuestaRepo.AddRespuestaAsync(entity);
            return result > 0;
        }

        // Método para actualizar múltiples respuestas a la vez
        public async Task<bool> ActualizarRespuestasMasivasAsync(int userId, List<PreguntaRespuestaDto> dtos)
        {
            bool allUpdated = true;
            foreach (var dto in dtos)
            {
                var updated = await ActualizarRespuestaAsync(userId, dto);
                if (!updated) allUpdated = false;
            }
            return allUpdated;
        }
    }
}
