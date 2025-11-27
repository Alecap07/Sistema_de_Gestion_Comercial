using Application.Services;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScrapController : ControllerBase
    {
        private readonly ScrapService _scrapService;

        public ScrapController(ScrapService scrapService)
        {
            _scrapService = scrapService;
        }

        // 📄 Obtener todos los registros de Scrap
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var scrapList = await _scrapService.GetAllAsync();
            return Ok(scrapList);
        }

        // ♻️ Registrar un producto en Scrap
        [HttpPost("registrar")]
        public async Task<IActionResult> RegistrarScrap([FromBody] RegistrarScrapRequest request)
        {
            try
            {
                await _scrapService.RegistrarScrapAsync(
                    request.Codigo,
                    request.IdUsuario,
                    request.Cantidad,
                    request.Motivo,
                    request.Observaciones,
                    request.FechaScrap ?? DateTime.Now // Usa la que manden o la actual
                );

                return Ok(new
                {
                    mensaje = "♻️ Producto movido a Scrap correctamente.",
                    datos = request
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // 🔄 Actualizar Scrap existente
        [HttpPut("actualizar")]
        public async Task<IActionResult> ActualizarScrap([FromBody] ActualizarScrapRequest request)
        {
            try
            {
                await _scrapService.ActualizarScrapAsync(
                    request.IdScrap,
                    request.Cantidad,
                    request.Motivo,
                    request.Observaciones,
                    request.FechaScrap ?? DateTime.Now
                );

                return Ok(new { mensaje = "✅ Scrap actualizado correctamente." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }

    // ✅ Modelo para registrar Scrap
    public class RegistrarScrapRequest
    {
        public int Codigo { get; set; }
        public int IdUsuario { get; set; }
        public int Cantidad { get; set; }
        public string Motivo { get; set; } = string.Empty;
        public string? Observaciones { get; set; }
        public DateTime? FechaScrap { get; set; } // 🔹 Se muestra en Swagger, opcional
    }

    // ✅ Modelo para actualizar Scrap
    public class ActualizarScrapRequest
    {
        public int IdScrap { get; set; }
        public int Cantidad { get; set; }
        public string Motivo { get; set; } = string.Empty;
        public string? Observaciones { get; set; }
        public DateTime? FechaScrap { get; set; } // 🔹 También opcional
    }
}
