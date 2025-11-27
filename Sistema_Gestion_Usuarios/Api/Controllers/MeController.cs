using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using System.Threading.Tasks;
using Application.Services;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MeController : ControllerBase
    {
        private readonly UsuarioService _usuarioService;

        public MeController(UsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        [HttpGet]
        public async Task<IActionResult> GetMiPerfil(CancellationToken ct)
        {
            var idClaim = User.FindFirst("Id")?.Value;

            if (string.IsNullOrEmpty(idClaim))
                return Unauthorized();

            if (!int.TryParse(idClaim, out int idUsuario))
                return BadRequest();

            // Traigo info del usuario
            var usuario = await _usuarioService.GetUsuarioConPersonaPorIdAsync(idUsuario, ct);
            if (usuario == null)
                return NotFound();

            // Traigo permisos del usuario
            var permisos = await _usuarioService.ObtenerPermisosAsync(idUsuario, ct);

            usuario.Contraseña = null; // no enviamos la contraseña
            return Ok(new
            {
                usuario,
                permisos
            });
        }
    }
}
