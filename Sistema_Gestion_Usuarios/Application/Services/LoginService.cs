using System.Threading;
using System.Threading.Tasks;
using Domain.Entities;
using Common;
using Application.Services;

namespace Application.UseCases
{
    public class LoginUseCase
    {
        private readonly UsuarioService _usuarioService;
        private readonly HashService _hashService;

        public LoginUseCase(UsuarioService usuarioService, HashService hashService)
        {
            _usuarioService = usuarioService;
            _hashService = hashService;
        }

        public async Task<UsuarioDto> ValidarLoginAsync(LoginDTO dto, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(dto.Usuario) || string.IsNullOrWhiteSpace(dto.Contraseña))
                throw new System.Exception("Usuario y contraseña son obligatorios.");

            // 🔹 Traer usuario exacto por nombre
            var usuarioBD = await _usuarioService.GetByNombreUsuarioExactoAsync(dto.Usuario, ct);

            if (usuarioBD == null)
                throw new System.Exception("Usuario no encontrado.");

            // 🔹 Validar contraseña
            var hashIngresado = _hashService.ObtenerHashSHA256(dto.Contraseña);
            if (usuarioBD.Contraseña != hashIngresado)
                throw new System.Exception("Contraseña incorrecta.");

            // 🔹 Retornar DTO final
            return new UsuarioDto
            {
                Id = usuarioBD.Id,
                Nombre_Usuario = usuarioBD.Nombre_Usuario,
                Id_Rol = usuarioBD.Id_Rol,
                Usuario_Bloqueado = usuarioBD.Usuario_Bloqueado,
                PrimeraVez = usuarioBD.PrimeraVez,
                Fecha_Block = usuarioBD.Fecha_Block,
                Fecha_Ult_Cambio = usuarioBD.Fecha_Usu_Cambio
            };
        }
    }
}
