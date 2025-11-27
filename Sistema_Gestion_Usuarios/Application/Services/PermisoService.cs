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
    public class PermisoService
    {
        private readonly IPermisoRepository _repo;
        public PermisoService(IPermisoRepository repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<PermisoDto>> GetAllAsync(CancellationToken ct)
        {
            var entities = await _repo.GetAllAsync(ct);
            return entities.Select(PermisoMapper.ToDto);
        }
    }
}
