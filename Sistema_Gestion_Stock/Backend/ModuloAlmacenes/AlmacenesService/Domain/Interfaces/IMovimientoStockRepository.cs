using Domain.Entities;

namespace Domain.Interfaces
{
    public interface IMovimientoStockRepository
    {
        Task<IEnumerable<MovimientoStock>> GetAllAsync();
        Task<MovimientoStock?> GetByIdAsync(int id);
        Task AddAsync(MovimientoStock movimiento);
    }
}
