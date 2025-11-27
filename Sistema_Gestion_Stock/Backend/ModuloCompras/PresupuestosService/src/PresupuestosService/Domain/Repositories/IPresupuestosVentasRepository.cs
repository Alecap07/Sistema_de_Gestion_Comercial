using PresupuestosService.Domain.Entities;

namespace PresupuestosService.Domain.Repositories;

public interface IPresupuestosVentasRepository
{
    Task<int> CreateAsync(PresupuestoVenta entity);
    Task<PresupuestoVenta?> GetByIdAsync(int id);               // trae aunque esté inactivo
    Task<IReadOnlyList<PresupuestoVenta>> ListAllAsync(bool includeInactive); // general (todos, opcional incluir inactivos)
    Task<bool> UpdateAsync(PresupuestoVenta entity);
    Task<bool> SoftDeleteAsync(int id); // usa sp_PresupuestosVentas_Delete (Activo = 0)
}