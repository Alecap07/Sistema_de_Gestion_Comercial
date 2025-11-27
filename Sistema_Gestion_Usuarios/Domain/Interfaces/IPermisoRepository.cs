using Domain.Entities;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IPermisoRepository
    {
        Task<IEnumerable<Permisos>> GetAllAsync(CancellationToken ct);
    }
}
