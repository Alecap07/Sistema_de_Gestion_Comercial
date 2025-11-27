using RemitosService.Domain.Entities;
using RemitosService.Common.Enums;

namespace RemitosService.Domain.Interfaces;

public interface IRemitoItemRepository
{
    Task<RemitoItem?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<RemitoItem>> SearchAsync(
        int? remitoId,
        EstadoFiltro estadoFiltro,
        CancellationToken ct = default
    );
    Task<int> CreateAsync(RemitoItem entity, CancellationToken ct = default);
    Task UpdateAsync(int id, RemitoItem entity, CancellationToken ct = default);
}