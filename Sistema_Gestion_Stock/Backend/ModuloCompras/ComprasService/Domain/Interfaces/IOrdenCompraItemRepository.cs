using ComprasService.Domain.Entities;
using ComprasService.Common.Enums;

namespace ComprasService.Domain.Interfaces;

public interface IOrdenCompraItemRepository
{
    Task<OrdenCompraItem?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<OrdenCompraItem>> SearchAsync(int? ordenCompraId, EstadoFiltro estadoFiltro, CancellationToken ct = default);
    Task<int> CreateAsync(OrdenCompraItem entity, CancellationToken ct = default);
    Task UpdateAsync(int id, OrdenCompraItem entity, CancellationToken ct = default);
}