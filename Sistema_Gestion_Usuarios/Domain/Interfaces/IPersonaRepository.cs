using Domain.Entities;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IPersonaRepository
    {
        Task<List<Persona>> GetAllAsync(CancellationToken ct);
        Task<Persona?> GetByIdAsync(int id, CancellationToken ct);
        Task<int> AddAsync(Persona persona, CancellationToken ct);
        Task<int> UpdateAsync(Persona persona, CancellationToken ct);
    }
}
