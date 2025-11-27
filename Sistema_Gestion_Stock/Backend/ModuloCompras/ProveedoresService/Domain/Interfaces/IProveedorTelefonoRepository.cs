using ProveedoresService.Domain.Entities;
using ProveedoresService.Common.Enums;

namespace ProveedoresService.Domain.Interfaces;

public interface IProveedorTelefonoRepository
{
    Task<IEnumerable<ProveedorTelefono>> GetByProveedorAsync(int proveedorId, EstadoFiltro estado, CancellationToken ct = default);
    Task<ProveedorTelefono?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<int> CreateAsync(int proveedorId, ProveedorTelefono entity, CancellationToken ct = default);
    Task UpdateAsync(int id, ProveedorTelefono entity, CancellationToken ct = default);
}