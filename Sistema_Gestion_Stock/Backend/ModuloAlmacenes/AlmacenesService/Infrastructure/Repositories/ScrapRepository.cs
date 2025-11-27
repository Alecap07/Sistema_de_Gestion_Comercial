using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class ScrapRepository : IScrapRepository
    {
        private readonly AlmacenDbContext _context;

        public ScrapRepository(AlmacenDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Scrap>> GetAllAsync()
        {
            return await _context.Scrap
                .Include(s => s.Producto)
                .ToListAsync();
        }

        public async Task<Scrap?> GetByIdAsync(int id)
        {
            return await _context.Scrap
                .Include(s => s.Producto)
                .FirstOrDefaultAsync(s => s.IdScrap == id);
        }

        public async Task AddAsync(Scrap scrap)
        {
            await _context.Scrap.AddAsync(scrap);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Scrap scrap)
        {
            _context.Scrap.Update(scrap);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var scrap = await _context.Scrap.FindAsync(id);
            if (scrap != null)
            {
                _context.Scrap.Remove(scrap);
                await _context.SaveChangesAsync();
            }
        }
    }
}
