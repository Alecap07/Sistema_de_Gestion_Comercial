using Application.Services;
using Domain.Entities;
using Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RolPersonaController : ControllerBase
    {
        private readonly IRolRepository _rolRepo;
        private readonly IPersonaRepository _personaRepo;
        public RolPersonaController(IRolRepository rolRepo, IPersonaRepository personaRepo)
        {
            _rolRepo = rolRepo;
            _personaRepo = personaRepo;
        }

        [HttpGet("roles")]
        public async Task<IActionResult> GetRoles(CancellationToken ct)
        {
            var roles = await _rolRepo.GetAllAsync(ct);
            // Mapear a RolDto para que el campo 'Rol' tenga el nombre correcto
            var rolesDto = roles.ConvertAll(r => new Common.RolDto
            {
                Id = r.Id,
                Rol = r.Nombre // Asigna el nombre del rol al campo 'Rol' del DTO
            });
            return Ok(rolesDto);
        }

        [HttpGet("personas")]
        public async Task<IActionResult> GetPersonas(CancellationToken ct)
            => Ok(await _personaRepo.GetAllAsync(ct));
    }
}
