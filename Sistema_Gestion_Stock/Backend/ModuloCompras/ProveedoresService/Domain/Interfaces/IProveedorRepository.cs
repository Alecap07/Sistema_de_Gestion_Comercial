using ProveedoresService.Domain.Entities;
using ProveedoresService.Common.Enums;

namespace ProveedoresService.Domain.Interfaces;

public interface IProveedorRepository
{
    Task<Proveedor?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<Proveedor?> GetByCodigoAsync(string codigo, CancellationToken ct = default);
    Task<IEnumerable<Proveedor>> SearchAsync(
        string? razonSocial,
        string? codigo,
        int? personaId,
        EstadoFiltro estado = EstadoFiltro.Activos,
        CancellationToken ct = default);
    Task<int> CreateAsync(Proveedor entity, CancellationToken ct = default);
    Task UpdateAsync(Proveedor entity, CancellationToken ct = default);
}