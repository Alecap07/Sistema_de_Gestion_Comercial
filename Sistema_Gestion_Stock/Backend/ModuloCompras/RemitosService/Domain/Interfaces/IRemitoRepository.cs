using RemitosService.Domain.Entities;
using RemitosService.Common.Enums;

namespace RemitosService.Domain.Interfaces;

public interface IRemitoRepository
{
    Task<Remito?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<Remito>> SearchAsync(
        int? proveedorId,
        int? ordenCompraId,
        DateTime? fechaDesde,
        DateTime? fechaHasta,
        EstadoFiltro estadoFiltro,
        CancellationToken ct = default
    );
    Task<int> CreateAsync(Remito entity, CancellationToken ct = default);
    Task UpdateAsync(int id, Remito entity, CancellationToken ct = default);
}