using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.UseCases;
using Common;
using Microsoft.Extensions.Configuration;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly LoginUseCase _loginUseCase;
        private readonly IConfiguration _config;

        public LoginController(LoginUseCase loginUseCase, IConfiguration config)
        {
            _loginUseCase = loginUseCase;
            _config = config;
        }

        // POST api/login
        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginDTO? dto, CancellationToken ct)
        {
            System.Console.WriteLine("Login DTO recibido:");
            System.Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(dto));

            if (dto == null)
                return BadRequest("No se recibieron datos.");

            if (string.IsNullOrWhiteSpace(dto.Usuario) || string.IsNullOrWhiteSpace(dto.Contraseña))
                return BadRequest("Usuario y contraseña son obligatorios.");

            try
            {
                var usuario = await _loginUseCase.ValidarLoginAsync(dto, ct);

                if (usuario.Usuario_Bloqueado)
                    return BadRequest("Usuario bloqueado. No puede ingresar.");

                // 🔹 Configuración JWT
                var secretKey = _config["JwtSettings:SecretKey"] ?? throw new Exception("JWT Key no configurada");
                var issuer = _config["JwtSettings:Issuer"] ?? "MiSistema";
                var audience = _config["JwtSettings:Audience"] ?? "MiSistemaUsuarios";

                if (!int.TryParse(_config["JwtSettings:ExpiryMinutes"], out int expiryMinutes))
                    expiryMinutes = 60;

                // 🔹 Claims
                var claims = new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, usuario.Nombre_Usuario ?? ""),
                    new Claim("Id", usuario.Id.ToString()),
                    new Claim("Rol", usuario.Id_Rol.ToString())
                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: issuer,
                    audience: audience,
                    claims: claims,
                    expires: System.DateTime.UtcNow.AddMinutes(expiryMinutes),
                    signingCredentials: creds
                );

                var jwtToken = new JwtSecurityTokenHandler().WriteToken(token);

                // 🔹 Devolver usuario + token
                var response = new
                {
                    usuario.Id,
                    usuario.Nombre_Usuario,
                    usuario.Id_Rol,
                    usuario.Usuario_Bloqueado,
                    usuario.PrimeraVez,
                    Token = jwtToken
                };

                System.Console.WriteLine("Token generado: " + jwtToken);

                return Ok(response);
            }
            catch (System.Exception ex)
            {
                System.Console.WriteLine("Error login:");
                System.Console.WriteLine(ex.ToString());
                return BadRequest(ex.Message);
            }
        }
    }
}
