using PresupuestosService.Domain.Entities;

namespace PresupuestosService.Domain.Repositories;

public interface IPresupuestosVentasItemsRepository
{
    Task<int> CreateAsync(PresupuestoVentaItem entity);
    Task<PresupuestoVentaItem?> GetByIdAsync(int id);    
    Task<IReadOnlyList<PresupuestoVentaItem>> ListByPresupuestoAsync(int presupuestoVentaId); 
    Task<bool> UpdateAsync(PresupuestoVentaItem entity);
    Task<bool> SoftDeleteAsync(int id); 
}