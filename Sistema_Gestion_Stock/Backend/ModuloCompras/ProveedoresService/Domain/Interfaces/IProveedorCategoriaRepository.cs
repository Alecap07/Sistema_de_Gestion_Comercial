using ProveedoresService.Domain.Entities;
using ProveedoresService.Common.Enums;

namespace ProveedoresService.Domain.Interfaces;

public interface IProveedorCategoriaRepository
{
    Task<IEnumerable<ProveedorCategoria>> GetByProveedorAsync(int proveedorId, EstadoFiltro estado, CancellationToken ct = default);
    Task<ProveedorCategoria?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<int> CreateAsync(int proveedorId, ProveedorCategoria entity, CancellationToken ct = default);
    Task UpdateAsync(int id, ProveedorCategoria entity, CancellationToken ct = default);
}