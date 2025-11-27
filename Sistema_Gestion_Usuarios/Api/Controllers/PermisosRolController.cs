using Application.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PermisosRolController : ControllerBase
    {
        private readonly PermisosRolService _service;
        // ...existing code...

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Common.PermisosRolDto dto, CancellationToken ct)
        {
            dto.Id_PermisosRol = id;
            await _service.UpdateAsync(dto, ct);
            return Ok();
        }

        public PermisosRolController(PermisosRolService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken ct)
        {
            var asignaciones = await _service.GetAllJoinAsync(ct);
            return Ok(asignaciones);
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] Common.PermisosRolDto dto, CancellationToken ct)
        {
            await _service.AddAsync(dto, ct);
            return Ok();
        }
    }
}
