using Domain.Entities;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IPermisosUserRepository
    {
        Task<List<PermisosUser>> GetAllAsync(CancellationToken ct);
        Task AddAsync(PermisosUser entity, CancellationToken ct);
        Task UpdateAsync(PermisosUser entity, CancellationToken ct);
    }
}
