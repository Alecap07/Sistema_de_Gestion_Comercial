// placeholder
using FacturasService.Domain.Entities;
using FacturasService.Common.Enums;

namespace FacturasService.Domain.Interfaces;

public interface INotaDebitoRepository
{
    Task<NotaDebito?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<NotaDebito>> SearchAsync(
        int? proveedorId,
        int? facturaId,
        DateTime? fechaDesde,
        DateTime? fechaHasta,
        EstadoFiltro estadoFiltro,
        CancellationToken ct = default
    );
    Task<int> CreateAsync(NotaDebito entity, CancellationToken ct = default);
    Task UpdateAsync(int id, NotaDebito entity, CancellationToken ct = default);
}