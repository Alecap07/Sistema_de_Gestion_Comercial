using PresupuestosService.Domain.Entities;

namespace PresupuestosService.Domain.Repositories;

public interface IPresupuestosVentasRepository
{
    Task<int> CreateAsync(PresupuestoVenta entity);
    Task<PresupuestoVenta?> GetByIdAsync(int id);               
    Task<IReadOnlyList<PresupuestoVenta>> ListAllAsync(bool includeInactive); 
    Task<bool> UpdateAsync(PresupuestoVenta entity);
    Task<bool> SoftDeleteAsync(int id);  
}