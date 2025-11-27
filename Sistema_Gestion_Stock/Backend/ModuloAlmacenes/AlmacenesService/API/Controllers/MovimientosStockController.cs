using Application.Services;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MovimientosStockController : ControllerBase
    {
        private readonly MovimientoStockService _movimientoService;

        public MovimientosStockController(MovimientoStockService movimientoService)
        {
            _movimientoService = movimientoService;
        }

        // 📦 Obtener todos los movimientos
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var movimientos = await _movimientoService.GetAllAsync();
            return Ok(movimientos);
        }

        // 🧾 Registrar movimiento de entrada o salida
        [HttpPost("registrar")]
        public async Task<IActionResult> RegistrarMovimiento([FromBody] MovimientoStockRequest request)
        {
            try
            {
                await _movimientoService.RegistrarMovimientoAsync(
                    request.ProductoId,
                    request.TipoMovimiento,
                    request.Cantidad,
                    request.Motivo
                );

                return Ok(new
                {
                    mensaje = "✅ Movimiento registrado correctamente.",
                    datos = request
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // 📊 Obtener movimientos con filtros
        [HttpGet("filtrar")]
        public async Task<IActionResult> GetFiltrado(
            [FromQuery] string? tipo,
            [FromQuery] DateTime? desde,
            [FromQuery] DateTime? hasta,
            [FromQuery] int? productoId)
        {
            var result = await _movimientoService.GetFiltradoAsync(tipo, desde, hasta, productoId);
            return Ok(result);
        }


    }

    // ✅ Modelo auxiliar para Swagger
    public class MovimientoStockRequest
    {
        public int ProductoId { get; set; }
        public string TipoMovimiento { get; set; } = string.Empty; // "Entrada" o "Salida"
        public int Cantidad { get; set; }
        public int? Motivo { get; set; } // opcional: Id del motivo
    }
}
