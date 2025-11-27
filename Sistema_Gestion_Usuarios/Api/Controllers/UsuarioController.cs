using Application.Services;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using System.Threading.Tasks;
using Common; // Aquí está PrimeraContraseñaDto
using Microsoft.AspNetCore.Authorization;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuarioController : ControllerBase
    {
        private readonly UsuarioService _service;

        public UsuarioController(UsuarioService service)
        {
            _service = service;
        }

        // 🔹 Obtener todos los usuarios, con filtro opcional por nombre
        [HttpGet("con-nombres")]
        public async Task<IActionResult> GetAllWithNames([FromQuery] string? nombre, CancellationToken ct)
        {
            if (!string.IsNullOrWhiteSpace(nombre))
                return Ok(await _service.GetAllWithNamesByNombreAsync(nombre, ct));

            return Ok(await _service.GetAllWithNamesAsync(ct));
        }

        // 🔹 Obtener todos los usuarios (lista completa)
        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken ct)
            => Ok(await _service.GetAllAsync(ct));

        // 🔹 Obtener usuario por Id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id, CancellationToken ct)
        {
            var usuario = await _service.GetByIdAsync(id, ct);
            return usuario is null ? NotFound() : Ok(usuario);
        }

        // 🔹 Agregar un nuevo usuario
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] Usuario usuario, CancellationToken ct)
        {
            usuario.Contraseña = null; // Ignorar cualquier contraseña enviada desde el frontend
            usuario.PrimeraVez = true; // 🔹 Obligatorio para primer acceso
            var id = await _service.AddAsync(usuario, ct);
            usuario.Id = id;
            usuario.Contraseña = null; // No devolver contraseña
            return CreatedAtAction(nameof(GetById), new { id }, usuario);
        }

        // 🔹 Actualizar usuario existente
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Usuario usuario, CancellationToken ct)
        {
            if (id != usuario.Id) return BadRequest();
            var ok = await _service.UpdateAsync(usuario, ct);
            return ok ? NoContent() : NotFound();
        }

        // 🔹 Obtener solo Id y Nombre de usuarios
        [HttpGet("solo-id-nombre")]
        public async Task<IActionResult> GetIdAndNombre(CancellationToken ct)
        {
            var usuarios = await _service.GetIdAndNombreAsync(ct);
            return Ok(usuarios);
        }

        // 🔹 Cambiar contraseña del usuario logueado (normal)
        [Authorize]
        [HttpPut("cambiar-contraseña")]
        public async Task<IActionResult> CambiarContrasena([FromBody] CambiarContrasenaDto dto, CancellationToken ct)
        {
            try
            {
                int usuarioId = int.Parse(User.FindFirst("id")?.Value ?? "0");

                bool exito = await _service.CambiarContrasenaAsync(usuarioId, dto.ContraseñaActual, dto.NuevaContraseña, ct);
                if (!exito) return BadRequest("Contraseña actual incorrecta o usuario no encontrado");

                return Ok("Contraseña cambiada correctamente");
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // 🔹 Cambiar contraseña primera vez (solo nueva contraseña)
        [Authorize]
        [HttpPut("cambiar-contraseña-primera-vez")]
        public async Task<IActionResult> CambiarContrasenaPrimeraVez([FromBody] PrimeraContraseñaDto dto, CancellationToken ct)
        {
            try
            {
                int usuarioId = int.Parse(User.FindFirst("id")?.Value ?? "0");

                bool exito = await _service.CambiarContrasenaPrimeraVezAsync(usuarioId, dto.NuevaContraseña, ct);
                if (!exito) return BadRequest("Usuario no encontrado o ya completó el primer acceso");

                return Ok("Contraseña cambiada correctamente (primera vez)");
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
