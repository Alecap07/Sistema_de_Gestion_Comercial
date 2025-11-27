using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class ScrapService
    {
        private readonly IScrapRepository _scrapRepo;
        private readonly IProductoRepository _productoRepo;
        private readonly IMovimientoStockRepository _movimientoRepo;
        private readonly AlmacenDbContext _context;

        public ScrapService(
            IScrapRepository scrapRepo,
            IProductoRepository productoRepo,
            IMovimientoStockRepository movimientoRepo,
            AlmacenDbContext context)
        {
            _scrapRepo = scrapRepo;
            _productoRepo = productoRepo;
            _movimientoRepo = movimientoRepo;
            _context = context;
        }

        // 🔹 Obtener todos los registros de scrap
        public async Task<IEnumerable<Scrap>> GetAllAsync() => await _scrapRepo.GetAllAsync();

        // 🔹 Registrar producto a scrap
        public async Task RegistrarScrapAsync(
            int codigo,
            int usuarioId,
            int cantidad,
            string motivo,
            string? observaciones,
            DateTime fechaScrap)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // 1️⃣ Validar producto
                var producto = await _productoRepo.GetByCodigoAsync(codigo)
                    ?? throw new Exception("El producto no existe.");

                // 2️⃣ Validar stock suficiente
                if (producto.Stock < cantidad)
                    throw new Exception("No hay stock suficiente para enviar a scrap.");

                // 3️⃣ Descontar del stock
                producto.Stock -= cantidad;

                // 4️⃣ Crear registro de scrap
                var scrap = new Scrap
                {
                    Codigo = codigo,
                    IdUsuario = usuarioId,
                    Cantidad = cantidad,
                    Motivo = motivo,
                    FechaScrap = fechaScrap,
                    Observaciones = observaciones
                };

                // 5️⃣ Crear también el movimiento automático con motivo + observación
                string detalleMovimiento = $"Salida por Scrap - Motivo: {motivo}";
                if (!string.IsNullOrWhiteSpace(observaciones))
                    detalleMovimiento += $" - Observación: {observaciones}";

                var movimiento = new MovimientoStock
                {
                    Codigo = codigo,
                    TipoMovimiento = "Salida",
                    Cantidad = cantidad,
                    IdOrden = null, // No viene de una orden
                    Observaciones = detalleMovimiento,
                    FechaMovimiento = fechaScrap
                };

                // 6️⃣ Guardar scrap, movimiento y actualizar producto
                await _scrapRepo.AddAsync(scrap);
                await _movimientoRepo.AddAsync(movimiento);
                await _productoRepo.UpdateAsync(producto);

                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        // 🔹 Actualizar Scrap existente
        public async Task ActualizarScrapAsync(
            int idScrap,
            int cantidad,
            string motivo,
            string? observaciones,
            DateTime fechaScrap)
        {
            var scrap = await _scrapRepo.GetByIdAsync(idScrap)
                ?? throw new Exception("El registro de Scrap no existe.");

            scrap.Cantidad = cantidad;
            scrap.Motivo = motivo;
            scrap.Observaciones = observaciones;
            scrap.FechaScrap = fechaScrap;

            await _scrapRepo.UpdateAsync(scrap);
        }
    }
}
