using Domain.Entities;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IPartidoRepository
    {
        Task<List<Partido>> GetAllAsync(CancellationToken ct);
    }
}
