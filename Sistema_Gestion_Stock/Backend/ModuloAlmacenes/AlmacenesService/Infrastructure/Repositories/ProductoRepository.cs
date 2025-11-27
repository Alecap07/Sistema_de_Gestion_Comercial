using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class ProductoRepository : IProductoRepository
    {
        private readonly AlmacenDbContext _context;

        public ProductoRepository(AlmacenDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Producto>> GetAllAsync()
            => await _context.Productos.ToListAsync();

        public async Task<Producto?> GetByIdAsync(int id)
            => await _context.Productos.FindAsync(id);

        public async Task AddAsync(Producto producto)
        {
            _context.Productos.Add(producto);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Producto producto)
        {
            _context.Productos.Update(producto);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var producto = await _context.Productos.FindAsync(id);
            if (producto == null)
                throw new Exception("El producto no existe.");

            // 🔍 Verificar si tiene movimientos asociados
            bool tieneMovimientos = await _context.MovimientosStock
            .AnyAsync(m => m.Codigo == producto.Codigo);


            if (tieneMovimientos)
            {
                // 🔹 Desactivar el producto
                producto.Activo = false;
                await _context.SaveChangesAsync();
            }
            else
            {
                // 🔹 Eliminar completamente
                _context.Productos.Remove(producto);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<Producto?> GetByCodigoAsync(int codigo)
        {
            return await _context.Productos
                .FirstOrDefaultAsync(p => p.Codigo == codigo);
        }


    }
}
