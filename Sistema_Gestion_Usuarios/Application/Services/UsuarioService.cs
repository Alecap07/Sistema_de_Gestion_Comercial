using Domain.Entities;
using Domain.Interfaces;
using Common;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using System;
using Microsoft.Extensions.Configuration;


namespace Application.Services
{
    public class UsuarioService
    {
        private readonly IUsuarioRepository _repository;
        private readonly IPersonaRepository _personaRepository;
        private readonly HashService _hashService;
        private readonly IEmailService _emailService;
        private readonly string _frontendBaseUrl;

        public UsuarioService(
            IUsuarioRepository repository,
            IPersonaRepository personaRepository,
            HashService hashService,
            IEmailService emailService,
            IConfiguration config)
        {
            _repository = repository;
            _personaRepository = personaRepository;
            _hashService = hashService;
            _emailService = emailService;
            _frontendBaseUrl = config["FrontendBaseUrl"] ?? "http://localhost:3000";
        }

        // 🔹 Devuelve la lista de entidades Usuario (puede servir para lógica interna)
        public Task<List<Usuario>> GetAllAsync(CancellationToken ct) => _repository.GetAllAsync(ct);

        // 🔹 Devuelve una entidad Usuario por id
        public Task<Usuario?> GetByIdAsync(int id, CancellationToken ct) => _repository.GetByIdAsync(id, ct);

        // 🔹 Alta de usuario: genera y hashea la contraseña y envía correo
        public async Task<int> AddAsync(Usuario usuario, CancellationToken ct)
        {
            // 1️⃣ Generar y hashear contraseña
            string plainPassword = _hashService.GenerarPasswordRandom();
            usuario.Contraseña = _hashService.ObtenerHashSHA256(plainPassword);
            usuario.PrimeraVez = true;
            usuario.Fecha_Usu_Cambio = DateTime.UtcNow;

            // 2️⃣ Guardar usuario en base
            var id = await _repository.AddAsync(usuario, ct);
            usuario.Id = id;

            // 3️⃣ Obtener persona asociada
            var persona = await _personaRepository.GetByIdAsync(usuario.Id_Per, ct);
            if (persona == null || string.IsNullOrWhiteSpace(persona.Email_Personal))
                return id;

            // 4️⃣ Generar link de acceso
            var url = $"{_frontendBaseUrl}/login";

            // 5️⃣ Crear cuerpo HTML con el mismo diseño que tu ejemplo
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
      <p>Hola <strong>{persona.Nombre} {persona.Apellido}</strong>,</p>
      <p>Tu cuenta en el sistema fue creada exitosamente.<br>
      A continuación te dejamos tus credenciales de acceso inicial:</p>

      <div style=""background:#f9f9f9;border-radius:10px;padding:15px;margin:25px 0;
      border:1px solid #eee;"">
          <p><b>Usuario:</b> {usuario.Nombre_Usuario}</p>
          <p><b>Contraseña temporal:</b> {plainPassword}</p>
      </div>

      <p>Al ingresar por primera vez al sistema, se te solicitará <strong>cambiar la contraseña</strong> para completar tu registro.</p>

      <div style=""text-align:center;margin:30px 0;"">
          <a href=""{url}""
             style=""background:linear-gradient(90deg,#00bcd4,#0097a7);
                    color:#fff;text-decoration:none;padding:14px 32px;
                    border-radius:10px;font-weight:600;display:inline-block;
                    box-shadow:0 6px 20px rgba(0,188,212,0.4);
                    transition:all 0.3s ease;"">
             Iniciar sesión
          </a>
      </div>


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

            try
            {
                await _emailService.SendEmailAsync(persona.Email_Personal, "Creación de cuenta", body);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"⚠️ Error al enviar correo a {persona.Email_Personal}: {ex.Message}");
            }

            return id;
        }

        // 🔹 Actualización de usuario (sin modificar contraseña)
        public Task<bool> UpdateAsync(Usuario usuario, CancellationToken ct) => _repository.UpdateAsync(usuario, ct);

        // 🔹 Devuelve todos los usuarios mapeados a DTO
        public async Task<List<UsuarioDto>> GetAllWithNamesAsync(CancellationToken ct)
        {
            var usuarios = await _repository.GetAllAsync(ct);
            var dtos = new List<UsuarioDto>();

            foreach (var usuario in usuarios)
                dtos.Add(Common.Mappers.UsuarioMapper.ToDto(usuario));

            return dtos;
        }

        // 🔹 Filtra usuarios por nombre y devuelve DTOs
        public async Task<List<UsuarioDto>> GetAllWithNamesByNombreAsync(string nombre, CancellationToken ct)
        {
            var usuarios = await _repository.GetAllAsync(ct);
            var filtrados = usuarios.FindAll(u =>
                u.Nombre_Usuario != null && u.Nombre_Usuario.Contains(nombre));

            var dtos = new List<UsuarioDto>();
            foreach (var usuario in filtrados)
                dtos.Add(Common.Mappers.UsuarioMapper.ToDto(usuario));

            return dtos;
        }

        // 🔹 Devuelve solo id y nombre de usuario
        public async Task<List<UsuarioDto>> GetIdAndNombreAsync(CancellationToken ct)
        {
            var usuarios = await _repository.GetAllAsync(ct);
            var dtos = new List<UsuarioDto>();

            foreach (var usuario in usuarios)
            {
                dtos.Add(new UsuarioDto
                {
                    Id = usuario.Id,
                    Nombre_Usuario = usuario.Nombre_Usuario
                });
            }

            return dtos;
        }

        // 🔹 Obtener usuario exacto por nombre de usuario
        public Task<Usuario?> GetByNombreUsuarioExactoAsync(string nombre, CancellationToken ct)
        {
            return _repository.GetByNombreExactoAsync(nombre, ct);
        }

        // 🔹 Obtener usuario + persona asociada
        public async Task<Usuario?> GetUsuarioConPersonaPorIdAsync(int id, CancellationToken ct)
        {
            var usuario = await _repository.GetByIdAsync(id, ct);
            if (usuario == null) return null;

            if (usuario.Id_Per > 0)
                usuario.Persona = await _personaRepository.GetByIdAsync(usuario.Id_Per, ct);

            return usuario;
        }

        // 🔹 Cambiar contraseña normal
        public async Task<bool> CambiarContrasenaAsync(int usuarioId, string contrasenaActual, string nuevaContrasena, CancellationToken ct)
        {
            var usuario = await _repository.GetByIdAsync(usuarioId, ct);
            if (usuario == null) return false;

            var hashActual = _hashService.ObtenerHashSHA256(contrasenaActual);
            if (usuario.Contraseña != hashActual)
                throw new Exception("Contraseña actual incorrecta");

            usuario.Contraseña = _hashService.ObtenerHashSHA256(nuevaContrasena);
            usuario.Fecha_Usu_Cambio = DateTime.UtcNow;

            return await _repository.UpdateAsync(usuario, ct);
        }

        // 🔹 Cambiar contraseña primera vez
        public async Task<bool> CambiarContrasenaPrimeraVezAsync(int usuarioId, string nuevaContrasena, CancellationToken ct)
        {
            var usuario = await _repository.GetByIdAsync(usuarioId, ct);
            if (usuario == null) return false;

            if (!usuario.PrimeraVez) return false;

            usuario.Contraseña = _hashService.ObtenerHashSHA256(nuevaContrasena);
            usuario.Fecha_Usu_Cambio = DateTime.UtcNow;
            usuario.PrimeraVez = false;

            return await _repository.UpdateAsync(usuario, ct);
        }

        // 🔹 Guardar respuesta
        public async Task<bool> GuardarRespuestaAsync(Respuesta respuesta, CancellationToken ct)
        {
            if (respuesta.Id_User <= 0 || respuesta.Id_Pregun <= 0 || string.IsNullOrWhiteSpace(respuesta.Texto))
                throw new Exception("Datos de respuesta incompletos");

            await _repository.GuardarRespuestaAsync(respuesta, ct);
            return true;
        }
        // 🔹 Obtener lista de permisos de un usuario
public Task<List<string>> ObtenerPermisosAsync(int idUsuario, CancellationToken ct)
{
    return _repository.GetPermisosUsuarioAsync(idUsuario, ct);
}
    }
}
