using PresupuestosService.Domain.Entities;

namespace PresupuestosService.Domain.Repositories;

public interface IPresupuestosVentasItemsRepository
{
    Task<int> CreateAsync(PresupuestoVentaItem entity);
    Task<PresupuestoVentaItem?> GetByIdAsync(int id);    // trae aunque esté inactivo
    Task<IReadOnlyList<PresupuestoVentaItem>> ListByPresupuestoAsync(int presupuestoVentaId); // solo activos según SP
    Task<bool> UpdateAsync(PresupuestoVentaItem entity);
    Task<bool> SoftDeleteAsync(int id); // no hay SP delete => usamos Update con Activo=0
}