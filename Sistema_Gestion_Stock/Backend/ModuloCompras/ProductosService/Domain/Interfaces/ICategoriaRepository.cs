using ProductosService.Common.Enums;
using ProductosService.Domain.Entities;

namespace ProductosService.Domain.Interfaces;

public interface ICategoriaRepository
{
    Task<Categoria?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<Categoria>> GetAllAsync(EstadoFiltro estado = EstadoFiltro.Activos, CancellationToken ct = default);
    Task<int> CreateAsync(Categoria entity, CancellationToken ct = default);
    Task UpdateAsync(Categoria entity, CancellationToken ct = default);
}