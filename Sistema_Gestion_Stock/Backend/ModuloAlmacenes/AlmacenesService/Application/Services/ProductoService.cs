using Application.DTOs;
using Domain.Entities;
using Domain.Interfaces;

namespace Application.Services
{
    public class ProductoService
    {
        private readonly IProductoRepository _repo;

        public ProductoService(IProductoRepository repo)
        {
            _repo = repo;
        }

        // 🔹 Obtener todos los productos activos
        public async Task<IEnumerable<Producto>> GetAllAsync()
        {
            var productos = await _repo.GetAllAsync();
            return productos.Where(p => p.Activo);
        }

        // 🔹 Obtener todos los productos inactivos
        public async Task<IEnumerable<Producto>> GetAllInactivosAsync()
        {
            var productos = await _repo.GetAllAsync();
            return productos.Where(p => !p.Activo);
        }

        // 🔹 Buscar por Id
        public async Task<ProductoDTO?> GetByIdAsync(int id)
        {
            var p = await _repo.GetByIdAsync(id);
            if (p == null) return null;

            return new ProductoDTO
            {
                IdProducto = p.IdProducto,
                Codigo = p.Codigo,
                Nombre = p.Nombre,
                Descripcion = p.Descripcion,
                Precio = p.Precio,
                Stock = p.Stock,
                Lote = p.Lote,
                FechaVencimiento = p.FechaVencimiento,
                Activo = p.Activo,
                FechaCreacion = p.FechaCreacion
            };
        }

        // 🔹 Crear nuevo producto
        public async Task AddAsync(ProductoDTO dto)
        {
            var entity = new Producto
            {
                Codigo = dto.Codigo,
                Nombre = dto.Nombre ?? string.Empty,
                Descripcion = dto.Descripcion ?? string.Empty,
                Precio = dto.Precio,
                Stock = dto.Stock,
                Lote = dto.Lote,
                FechaVencimiento = dto.FechaVencimiento,
                Activo = true,
                FechaCreacion = DateTime.Now
            };

            await _repo.AddAsync(entity);
        }

        // 🔹 Actualizar producto existente
        public async Task UpdateAsync(ProductoDTO dto)
        {
            var entity = await _repo.GetByIdAsync(dto.IdProducto)
                         ?? throw new Exception("Producto no encontrado.");

            entity.Nombre = dto.Nombre ?? entity.Nombre;
            entity.Descripcion = dto.Descripcion ?? entity.Descripcion;
            entity.Precio = dto.Precio;
            entity.Stock = dto.Stock;
            entity.Lote = dto.Lote;
            entity.FechaVencimiento = dto.FechaVencimiento;
            entity.Activo = dto.Activo;

            await _repo.UpdateAsync(entity);
        }

        // 🔹 Eliminar o desactivar producto
public async Task<string> DeleteAsync(int id)
{
    var producto = await _repo.GetByIdAsync(id)
                   ?? throw new Exception("Producto no encontrado.");

    if (producto.MovimientosStock != null && producto.MovimientosStock.Any())
    {
        producto.Activo = false; // solo desactivar
        await _repo.UpdateAsync(producto);
        return "desactivado";
    }
    else
    {
        await _repo.DeleteAsync(id);
        return "eliminado";
    }
}
        
    }
}
