using Domain.Entities;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface ILocalidadRepository
    {
        Task<List<Localidad>> GetAllAsync(CancellationToken ct);
    }
}
