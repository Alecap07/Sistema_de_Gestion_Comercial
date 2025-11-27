// placeholder
using FacturasService.Domain.Entities;
using FacturasService.Common.Enums;

namespace FacturasService.Domain.Interfaces;

public interface IFacturaCompraRepository
{
    Task<FacturaCompra?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<FacturaCompra>> SearchAsync(
        int? proveedorId,
        string? numeroFactura,
        DateTime? fechaDesde,
        DateTime? fechaHasta,
        EstadoFiltro estadoFiltro,
        CancellationToken ct = default
    );
    Task<int> CreateAsync(FacturaCompra entity, CancellationToken ct = default);
    Task UpdateAsync(int id, FacturaCompra entity, CancellationToken ct = default);
}