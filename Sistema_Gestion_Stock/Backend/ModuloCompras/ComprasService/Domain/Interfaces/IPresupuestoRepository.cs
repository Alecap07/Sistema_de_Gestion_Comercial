using ComprasService.Domain.Entities;
using ComprasService.Common.Enums;

namespace ComprasService.Domain.Interfaces;

public interface IPresupuestoRepository
{
    Task<Presupuesto?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<Presupuesto>> SearchAsync(int? proveedorId, string? estado, DateTime? fechaDesde, DateTime? fechaHasta, EstadoFiltro estadoFiltro, CancellationToken ct = default);
    Task<int> CreateAsync(Presupuesto entity, CancellationToken ct = default);
    Task UpdateAsync(int id, Presupuesto entity, CancellationToken ct = default);
}