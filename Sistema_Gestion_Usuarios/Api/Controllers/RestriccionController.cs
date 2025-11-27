using Domain.Interfaces;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RestriccionController : ControllerBase
    {
        private readonly IRestriccionRepository _repo;
        public RestriccionController(IRestriccionRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _repo.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var restriccion = await _repo.GetByIdAsync(id);
            if (restriccion == null) return NotFound();
            return Ok(restriccion);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Restriccion restriccion)
        {
            if (id != restriccion.Id) return BadRequest();
            await _repo.UpdateAsync(restriccion);
            return NoContent();
        }
    }
}
