using Common;
using Common.Mappers;
using Domain.Entities;
using Domain.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Services
{
    public class RestriccionService
    {
        private readonly IRestriccionRepository _repo;
        public RestriccionService(IRestriccionRepository repo)
        {
            _repo = repo;
        }
        public async Task<IEnumerable<RestriccionDto>> GetAllAsync()
        {
            var entities = await _repo.GetAllAsync();
            return entities.Select(RestriccionMapper.ToDto);
        }

        public async Task<RestriccionDto?> GetByIdAsync(int id)
        {
            var entity = await _repo.GetByIdAsync(id);
            return entity is null ? null : RestriccionMapper.ToDto(entity);
        }

        public Task UpdateAsync(RestriccionDto restriccion)
        {
            var entity = RestriccionMapper.ToEntity(restriccion);
            return _repo.UpdateAsync(entity);
        }
    }
}
