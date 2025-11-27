using ProveedoresService.Domain.Entities;
using ProveedoresService.Common.Enums;

namespace ProveedoresService.Domain.Interfaces;

public interface ICategoriaRepository
{
    Task<Categoria?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<Categoria>> SearchAsync(string? nombre, EstadoFiltro estado, CancellationToken ct = default);
    Task<int> CreateAsync(Categoria entity, CancellationToken ct = default);
    Task UpdateAsync(int id, Categoria entity, CancellationToken ct = default);
}