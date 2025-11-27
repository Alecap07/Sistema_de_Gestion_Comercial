// placeholder
using FacturasService.Domain.Entities;
using FacturasService.Common.Enums;

namespace FacturasService.Domain.Interfaces;

public interface IFacturaCompraRemitoRepository
{
    Task<FacturaCompraRemito?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<FacturaCompraRemito>> SearchAsync(
        int? facturaId,
        int? remitoId,
        EstadoFiltro estadoFiltro,
        CancellationToken ct = default
    );
    Task<int> CreateAsync(FacturaCompraRemito entity, CancellationToken ct = default);
    Task UpdateAsync(int id, FacturaCompraRemito entity, CancellationToken ct = default);
}