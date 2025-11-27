using Common;
using Infrastructure.Repositories;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Services
{
    public class PermisosRolService
    {
        private readonly PermisosRolRepository _repo;
        public PermisosRolService(PermisosRolRepository repo)
        {
            _repo = repo;
        }
        // ...existing code...

        public Task UpdateAsync(PermisosRolDto dto, CancellationToken ct)
        {
            return _repo.UpdateAsync(dto, ct);
        }

        public Task<List<PermisosRolDto>> GetAllJoinAsync(CancellationToken ct)
        {
            return _repo.GetAllJoinAsync(ct);
        }

        public Task AddAsync(PermisosRolDto dto, CancellationToken ct)
        {
            return _repo.AddAsync(dto, ct);
        }
    }
}
