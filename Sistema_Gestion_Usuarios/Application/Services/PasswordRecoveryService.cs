using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Domain.Dtos;
using Domain.Entities;
using Domain.Interfaces;
using Microsoft.Extensions.Configuration;

namespace Application.Services
{
    public class PasswordRecoveryService
    {
        private readonly IUsuarioRepository _usuarioRepo;
        private readonly ITokenRecuperacionRepository _tokenRepo;
        private readonly IPreguntaRepository _preguntaRepo;
        private readonly IRespuestaRepository _respuestaRepo;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _config;
        private readonly HashService _hashService;

        public PasswordRecoveryService(
            IUsuarioRepository usuarioRepo,
            ITokenRecuperacionRepository tokenRepo,
            IPreguntaRepository preguntaRepo,
            IRespuestaRepository respuestaRepo,
            IEmailService emailService,
            IConfiguration config,
            HashService hashService)
        {
            _usuarioRepo = usuarioRepo;
            _tokenRepo = tokenRepo;
            _preguntaRepo = preguntaRepo;
            _respuestaRepo = respuestaRepo;
            _emailService = emailService;
            _config = config;
            _hashService = hashService;
        }

        // 1️⃣ Solicitar recuperación por usuario o email
        public async Task<bool> SolicitarRecuperacionAsync(string usuarioOEmail, string frontendBaseUrl)
        {
            var (usuario, email) = await _usuarioRepo.GetUsuarioConEmailAsync(usuarioOEmail);
            if (usuario == null || string.IsNullOrWhiteSpace(email))
                return false; // no revelamos info

            var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));

            var tokenEntity = new TokenRecuperacion
            {
                IdUsuario = usuario.Id,
                Token = token,
                Estado = "pendiente",
                FechaCreacion = DateTime.UtcNow,
                FechaExpiracion = DateTime.UtcNow.AddMinutes(30)
            };

            await _tokenRepo.CreateAsync(tokenEntity);

            var url = $"{frontendBaseUrl}/validar-preguntas?token={Uri.EscapeDataString(token)}";

            
            var body = $@"
<div style=""max-width:520px;width:90%;margin:40px auto;
background:rgba(255,255,255,0.95);border:1px solid rgba(0,0,0,0.1);
border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,0.15);
text-align:left;padding:35px 30px 20px 30px;box-sizing:border-box;
font-family:'Segoe UI',Roboto,sans-serif;color:#222;"">

  <h2 style=""text-align:center;font-weight:400;font-size:1.8rem;
  color:#00bcd4;margin-top:0;margin-bottom:1.2rem;"">
    Soporte de Gestión de Usuarios
  </h2>

  <!-- CONTENIDO -->
  <div style=""padding:10px 0;font-size:16px;line-height:1.6;color:#333;"">
      <p>Hola <strong>{usuario.Nombre_Usuario}</strong>,</p>
      <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.<br>
      Si fuiste vos quien la realizó, por favor hacé clic en el siguiente botón para continuar con el proceso:</p>

      <div style=""text-align:center;margin:30px 0;"">
          <a href=""{url}""
             style=""background:linear-gradient(90deg,#00bcd4,#0097a7);
                    color:#fff;text-decoration:none;padding:14px 32px;
                    border-radius:10px;font-weight:600;display:inline-block;
                    box-shadow:0 6px 20px rgba(0,188,212,0.4);
                    transition:all 0.3s ease;"">
             Restablecer contraseña
          </a>
      </div>

      <p>Este enlace permanecerá activo durante <strong>30 minutos</strong>.<br>
      Una vez vencido ese tiempo, deberás generar una nueva solicitud.</p>

      <p>Si no solicitaste el restablecimiento, podés ignorar este mensaje.<br>
      Tu cuenta permanecerá segura.</p>

      <p style=""margin-top:25px;"">Atentamente,<br>
      <strong>Soporte de Gestión de Usuarios</strong></p>
  </div>

  <!-- PIE -->
  <div style=""background:#f9f9f9;padding:15px;text-align:center;
  font-size:13px;color:#777;border-top:1px solid #eee;
  border-radius:0 0 16px 16px;margin-top:25px;"">
      © {DateTime.Now.Year} Soporte de Gestión de Usuarios — Todos los derechos reservados.
  </div>

</div>";


            await _emailService.SendEmailAsync(email, "Recuperación de contraseña", body);
            return true;
        }

        // 2️⃣ Obtener preguntas de seguridad de un usuario mediante token
        public async Task<List<PreguntaRecuperacionDto>?> ObtenerPreguntasAsync(string token)
        {
            var tokenEntity = await _tokenRepo.GetByTokenAsync(token);
            if (tokenEntity == null || tokenEntity.Estado != "pendiente" || tokenEntity.FechaExpiracion <= DateTime.UtcNow)
                return null;

            return (await _respuestaRepo.ObtenerPreguntasDelUsuarioAsync(tokenEntity.IdUsuario))
                   ?? new List<PreguntaRecuperacionDto>();
        }

        // 3️⃣ Validar respuestas de seguridad
        public async Task<bool> ValidarRespuestasAsync(ValidarRespuestasRecuperacionDto dto)
        {
            var tokenEntity = await _tokenRepo.GetByTokenAsync(dto.Token);
            if (tokenEntity == null || tokenEntity.Estado != "pendiente" || tokenEntity.FechaExpiracion <= DateTime.UtcNow)
                return false;

            return await _respuestaRepo.ValidarRespuestasUsuarioAsync(tokenEntity.IdUsuario, dto.Respuestas);
        }

        // 4️⃣ Cambiar contraseña usando token (con hash SHA256)
        public async Task<bool> CambiarContrasenaAsync(string token, string nuevaContraseña)
        {
            var tokenEntity = await _tokenRepo.GetByTokenAsync(token);
            if (tokenEntity == null || tokenEntity.Estado != "pendiente" || tokenEntity.FechaExpiracion <= DateTime.UtcNow)
                return false;

            var usuario = await _usuarioRepo.GetByIdAsync(tokenEntity.IdUsuario, default);
            if (usuario == null) return false;

            // ✅ Aplicamos hash antes de guardar
            usuario.Contraseña = _hashService.ObtenerHashSHA256(nuevaContraseña);
            await _usuarioRepo.UpdateAsync(usuario, default);

            await _tokenRepo.MarkAsUsedAsync(tokenEntity.IdToken);
            return true;
        }
    }
}
