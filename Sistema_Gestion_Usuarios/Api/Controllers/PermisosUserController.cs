using Application.Services;
using Common;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using System;
using System.Linq;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PermisosUserController : ControllerBase
    {
        private readonly PermisosUserService _service;
        public PermisosUserController(PermisosUserService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<PermisosUserDto>>> GetAll([FromQuery] DateTime? fechaDesde, CancellationToken ct)
        {
            var result = await _service.GetAllAsync(ct);

            if (fechaDesde.HasValue)
                result = result.Where(x => x.Fecha_Vto != null && x.Fecha_Vto.Value.Date >= fechaDesde.Value.Date).ToList();

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] PermisosUserDto dto, CancellationToken ct)
        {
            try
            {
                await _service.AddAsync(dto, ct);
                return Ok();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] PermisosUserDto dto, CancellationToken ct)
        {
            try
            {
                await _service.UpdateAsync(dto, ct);
                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
