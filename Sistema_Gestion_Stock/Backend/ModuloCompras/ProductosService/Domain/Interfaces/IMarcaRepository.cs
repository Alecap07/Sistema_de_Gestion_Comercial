using ProductosService.Common.Enums;
using ProductosService.Domain.Entities;

namespace ProductosService.Domain.Interfaces;

public interface IMarcaRepository
{
    Task<Marca?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<Marca>> GetAllAsync(EstadoFiltro estado = EstadoFiltro.Activos, CancellationToken ct = default);
    Task<int> CreateAsync(Marca entity, CancellationToken ct = default);
    Task UpdateAsync(Marca entity, CancellationToken ct = default);
}