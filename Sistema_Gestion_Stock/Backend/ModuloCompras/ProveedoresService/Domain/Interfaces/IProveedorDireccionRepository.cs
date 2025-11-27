using ProveedoresService.Domain.Entities;
using ProveedoresService.Common.Enums;

namespace ProveedoresService.Domain.Interfaces;

public interface IProveedorDireccionRepository
{
    Task<IEnumerable<ProveedorDireccion>> GetByProveedorAsync(int proveedorId, EstadoFiltro estado, CancellationToken ct = default);
    Task<ProveedorDireccion?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<int> CreateAsync(int proveedorId, ProveedorDireccion entity, CancellationToken ct = default);
    Task UpdateAsync(int id, ProveedorDireccion entity, CancellationToken ct = default);
}