using Domain.Entities;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IProvinciaRepository
    {
        Task<List<Provincia>> GetAllAsync(CancellationToken ct);
    }
}
