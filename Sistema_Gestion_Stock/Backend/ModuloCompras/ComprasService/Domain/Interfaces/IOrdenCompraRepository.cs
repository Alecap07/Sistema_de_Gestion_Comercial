using ComprasService.Domain.Entities;
using ComprasService.Common.Enums;

namespace ComprasService.Domain.Interfaces;

public interface IOrdenCompraRepository
{
    Task<OrdenCompra?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<OrdenCompra>> SearchAsync(int? proveedorId, string? estado, DateTime? fechaDesde, DateTime? fechaHasta, EstadoFiltro estadoFiltro, CancellationToken ct = default);
    Task<int> CreateAsync(OrdenCompra entity, CancellationToken ct = default);
    Task UpdateAsync(int id, OrdenCompra entity, CancellationToken ct = default);
}