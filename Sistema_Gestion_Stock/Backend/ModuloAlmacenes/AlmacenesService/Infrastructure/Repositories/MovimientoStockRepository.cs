using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class MovimientoStockRepository : IMovimientoStockRepository
    {
        private readonly AlmacenDbContext _context;

        public MovimientoStockRepository(AlmacenDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<MovimientoStock>> GetAllAsync()
        {
            return await _context.MovimientosStock
                .AsNoTracking()
                .ToListAsync();
        }


        public async Task<MovimientoStock?> GetByIdAsync(int id)
        {
            return await _context.MovimientosStock
                .Include(m => m.Producto)
                .FirstOrDefaultAsync(m => m.IdMovimiento == id);
        }

        public async Task AddAsync(MovimientoStock movimiento)
        {
            _context.MovimientosStock.Add(movimiento);
            await _context.SaveChangesAsync();
        }
    }
}
