using Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RolController : ControllerBase
    {
        private readonly IRolService _rolService;

        public RolController(IRolService rolService)
        {
            _rolService = rolService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Domain.Interfaces.RolBasicDto>> GetAll()
        {
            var roles = _rolService.GetAll();
            return Ok(roles);
        }
    }
}
