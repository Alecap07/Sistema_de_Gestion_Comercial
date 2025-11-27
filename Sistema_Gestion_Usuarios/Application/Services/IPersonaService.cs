using Domain.Entities;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Common;

namespace Application.Services
{
    public interface IPersonaService
    {
    Task<List<PersonaDto>> GetAllAsync(CancellationToken ct);
    Task<PersonaDto?> GetByIdAsync(int id, CancellationToken ct);
    Task<int> AddAsync(PersonaDto persona, CancellationToken ct);
    Task<int> UpdateAsync(PersonaDto persona, CancellationToken ct);
    Task<int> DeleteAsync(int id, CancellationToken ct);
    }
}