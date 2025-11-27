using ComprasService.Domain.Entities;
using ComprasService.Common.Enums;

namespace ComprasService.Domain.Interfaces;

public interface IPresupuestoItemRepository
{
    Task<PresupuestoItem?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<PresupuestoItem>> SearchAsync(
        int? presupuestoId,
        EstadoFiltro estadoFiltro,
        CancellationToken ct = default
    );
    Task<int> CreateAsync(PresupuestoItem entity, CancellationToken ct = default);
    Task UpdateAsync(int id, PresupuestoItem entity, CancellationToken ct = default);
}