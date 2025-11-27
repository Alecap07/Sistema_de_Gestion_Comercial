using Domain.Entities;
using Domain.Interfaces;

namespace Application.Services
{
    public class MovimientoStockService
    {
        private readonly IMovimientoStockRepository _movimientoRepo;
        private readonly IProductoRepository _productoRepo;

        public MovimientoStockService(IMovimientoStockRepository movimientoRepo, IProductoRepository productoRepo)
        {
            _movimientoRepo = movimientoRepo;
            _productoRepo = productoRepo;
        }

        // 🔹 Obtener todos los movimientos
        public async Task<IEnumerable<MovimientoStock>> GetAllAsync()
        {
            return await _movimientoRepo.GetAllAsync();
        }

        // 🔹 Registrar un nuevo movimiento de stock (Entrada / Salida)
        public async Task RegistrarMovimientoAsync(int codigo, string tipo, int cantidad, int? idOrden = null, string? observaciones = null)
        {
            var producto = await _productoRepo.GetByCodigoAsync(codigo)
                ?? throw new Exception("El producto no existe.");

            if (tipo != "Entrada" && tipo != "Salida")
                throw new Exception("El tipo de movimiento debe ser 'Entrada' o 'Salida'.");

            if (tipo == "Salida" && producto.Stock < cantidad)
                throw new Exception("No hay stock suficiente.");

            // 🔸 Actualizar stock
            if (tipo == "Entrada")
                producto.Stock += cantidad;
            else if (tipo == "Salida")
                producto.Stock -= cantidad;

            // 🔸 Crear movimiento
            var movimiento = new MovimientoStock
            {
                Codigo = codigo,
                IdOrden = idOrden,
                TipoMovimiento = tipo,
                Cantidad = cantidad,
                FechaMovimiento = DateTime.Now,
                Observaciones = observaciones
            };

            // 🔸 Guardar en DB
            await _movimientoRepo.AddAsync(movimiento);
            await _productoRepo.UpdateAsync(producto);
        }

        // 🔹 Obtener movimientos filtrados
        public async Task<IEnumerable<MovimientoStock>> GetFiltradoAsync(
            string? tipo = null, DateTime? desde = null, DateTime? hasta = null, int? codigo = null)
        {
            var movimientos = await _movimientoRepo.GetAllAsync();

            if (!string.IsNullOrEmpty(tipo))
                movimientos = movimientos.Where(m => m.TipoMovimiento == tipo);

            if (codigo.HasValue)
                movimientos = movimientos.Where(m => m.Codigo == codigo.Value);

            if (desde.HasValue)
                movimientos = movimientos.Where(m => m.FechaMovimiento >= desde.Value);

            if (hasta.HasValue)
                movimientos = movimientos.Where(m => m.FechaMovimiento <= hasta.Value);

            return movimientos;
        }
    }
}
