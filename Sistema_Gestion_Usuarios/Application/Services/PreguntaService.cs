using Common;
using Common.Mappers;
using Domain.Entities;
using Domain.Interfaces;

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Services
{
    public class PreguntaService
    {
        private readonly IPreguntaRepository _repo;
        public PreguntaService(IPreguntaRepository repo)
        {
            _repo = repo;
        }

        // 🔹 Obtener preguntas aleatorias activas
        public async Task<List<PreguntaDto>> ObtenerRandomAsync(int cantidad)
        {
            var todas = await _repo.GetAllAsync(); // trae todas las preguntas
            var activas = todas.Where(p => p.Activa).ToList(); // filtrar solo activas

            if (!activas.Any()) return new List<PreguntaDto>(); // por si no hay preguntas activas

            return activas
                .OrderBy(x => System.Guid.NewGuid()) // mezclar aleatoriamente
                .Take(cantidad)                      // limitar a la cantidad pedida
                .Select(PreguntaMapper.ToDto)        // mapear a DTO
                .ToList();
        }

        // Obtener todas las preguntas (sin filtrar activas)
        public async Task<List<PreguntaDto>> ObtenerTodasAsync(string? busqueda = null)
        {
            var entities = await _repo.GetAllAsync(busqueda);
            return entities.Select(PreguntaMapper.ToDto).ToList();
        }

        // Obtener una pregunta por Id
        public async Task<PreguntaDto?> ObtenerPorIdAsync(int id)
        {
            var entity = await _repo.GetByIdAsync(id);
            return entity is null ? null : PreguntaMapper.ToDto(entity);
        }

        // Crear una pregunta
        public Task<int> CrearAsync(PreguntaDto dto)
        {
            var entity = PreguntaMapper.ToEntity(dto);
            return _repo.AddAsync(entity);
        }

        // Actualizar una pregunta
        public Task<int> ActualizarAsync(PreguntaDto dto)
        {
            var entity = PreguntaMapper.ToEntity(dto);
            return _repo.UpdateAsync(entity);
        }
    }
}
