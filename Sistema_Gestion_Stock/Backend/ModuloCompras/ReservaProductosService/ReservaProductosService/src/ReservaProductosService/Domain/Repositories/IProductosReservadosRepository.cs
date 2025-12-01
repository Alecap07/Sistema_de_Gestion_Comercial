using ReservaProductosService.Domain.Entities;

namespace ReservaProductosService.Domain.Repositories;

public interface IProductosReservadosRepository
{
    Task<int> CreateAsync(ProductoReservado entity);          
    Task<ProductoReservado?> GetByIdAsync(int id);            
    Task<IReadOnlyList<ProductoReservado>> ListAsync(bool soloActivos, bool soloInactivos); 
    Task<bool> UpdateAsync(ProductoReservado entity);        
    Task<bool> CancelAsync(int id);                       
}