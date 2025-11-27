using ProveedoresService.Domain.Entities;
using ProveedoresService.Common.Enums;

namespace ProveedoresService.Domain.Interfaces;

public interface IProveedorProductoRepository
{
    Task<IEnumerable<ProveedorProducto>> GetByProveedorAsync(int proveedorId, EstadoFiltro estado, CancellationToken ct = default);
    Task<ProveedorProducto?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<int> CreateAsync(int proveedorId, ProveedorProducto entity, CancellationToken ct = default);
    Task UpdateAsync(int id, ProveedorProducto entity, CancellationToken ct = default);
}