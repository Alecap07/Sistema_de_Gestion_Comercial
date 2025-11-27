using Common;
using Common.Mappers;
using Domain.Entities;
using Domain.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Services
{
    public class PersonaService
    {
        private readonly IPersonaRepository _repository;

        public PersonaService(IPersonaRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<PersonaDto>> GetAllAsync(CancellationToken ct)
        {
            var entities = await _repository.GetAllAsync(ct);
            return entities.Select(PersonaMapper.ToDto).ToList();
        }

        public async Task<PersonaDto?> GetByIdAsync(int id, CancellationToken ct)
        {
            var entity = await _repository.GetByIdAsync(id, ct);
            return entity is null ? null : PersonaMapper.ToDto(entity);
        }

        public Task<int> AddAsync(PersonaDto persona, CancellationToken ct)
        {
            var entity = PersonaMapper.ToEntity(persona);
            return _repository.AddAsync(entity, ct);
        }

        public Task<int> UpdateAsync(PersonaDto persona, CancellationToken ct)
        {
            var entity = PersonaMapper.ToEntity(persona);
            return _repository.UpdateAsync(entity, ct);
        }

    // Método Delete eliminado según requerimiento
    }
}
