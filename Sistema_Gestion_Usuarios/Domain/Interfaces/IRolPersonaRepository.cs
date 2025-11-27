using Domain.Entities;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IRolRepository
    {
        Task<List<Rol>> GetAllAsync(CancellationToken ct);
    }

}
