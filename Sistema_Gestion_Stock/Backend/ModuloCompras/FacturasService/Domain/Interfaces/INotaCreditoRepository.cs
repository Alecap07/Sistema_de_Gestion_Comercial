// placeholder
using FacturasService.Domain.Entities;
using FacturasService.Common.Enums;

namespace FacturasService.Domain.Interfaces;

public interface INotaCreditoRepository
{
    Task<NotaCredito?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<NotaCredito>> SearchAsync(
        int? proveedorId,
        int? facturaId,
        DateTime? fechaDesde,
        DateTime? fechaHasta,
        EstadoFiltro estadoFiltro,
        CancellationToken ct = default
    );
    Task<int> CreateAsync(NotaCredito entity, CancellationToken ct = default);
    Task UpdateAsync(int id, NotaCredito entity, CancellationToken ct = default);
}