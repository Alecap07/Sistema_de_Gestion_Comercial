// placeholder
using FacturasService.Domain.Entities;
using FacturasService.Common.Enums;

namespace FacturasService.Domain.Interfaces;

public interface IFacturaCompraItemRepository
{
    Task<FacturaCompraItem?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<FacturaCompraItem>> SearchAsync(
        int? facturaId,
        EstadoFiltro estadoFiltro,
        CancellationToken ct = default
    );
    Task<int> CreateAsync(FacturaCompraItem entity, CancellationToken ct = default);
    Task UpdateAsync(int id, FacturaCompraItem entity, CancellationToken ct = default);
}