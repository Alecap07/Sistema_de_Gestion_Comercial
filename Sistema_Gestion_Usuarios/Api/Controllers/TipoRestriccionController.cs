using Application.Services;
using Common;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TipoRestriccionController : ControllerBase
    {
        private readonly TipoRestriccionService _service;
        public TipoRestriccionController(TipoRestriccionService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TipoRestriccionDto>>> GetAll()
        {
            var tipos = await _service.GetAllAsync();
            return Ok(tipos);
        }
    }
}
