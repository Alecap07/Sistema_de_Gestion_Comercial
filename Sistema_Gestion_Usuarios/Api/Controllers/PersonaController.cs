using Domain.Interfaces;
using Domain.Entities;
using Common;
using Application.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PersonaController : ControllerBase
    {
    private readonly IPersonaRepository _personaRepository;
        private readonly IProvinciaRepository _provinciaRepository;
        private readonly IPartidoRepository _partidoRepository;
        private readonly ILocalidadRepository _localidadRepository;

    public PersonaController(IPersonaRepository personaRepository, IProvinciaRepository provinciaRepository, IPartidoRepository partidoRepository, ILocalidadRepository localidadRepository)
        {
            _personaRepository = personaRepository;
            _provinciaRepository = provinciaRepository;
            _partidoRepository = partidoRepository;
            _localidadRepository = localidadRepository;
        }
    [HttpGet("provincias")]
    public async Task<IActionResult> GetProvincias(CancellationToken ct)
    {
        var provincias = await _provinciaRepository.GetAllAsync(ct);
        return Ok(provincias);
    }

    [HttpGet("partidos")]
    public async Task<IActionResult> GetPartidos(CancellationToken ct)
    {
        var partidos = await _partidoRepository.GetAllAsync(ct);
        return Ok(partidos);
    }

    [HttpGet("localidades")]
    public async Task<IActionResult> GetLocalidades(CancellationToken ct)
    {
        var localidades = await _localidadRepository.GetAllAsync(ct);
        return Ok(localidades);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
        => Ok(await _personaRepository.GetAllAsync(ct));


    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id, CancellationToken ct)
    {
        var persona = await _personaRepository.GetByIdAsync(id, ct);
        return persona is null ? NotFound() : Ok(persona);
    }


    [HttpPost]
    public async Task<IActionResult> Add([FromBody] Persona persona, CancellationToken ct)
    {
        var id = await _personaRepository.AddAsync(persona, ct);
        if (id == -1)
            return BadRequest("Error al guardar persona. Verifique que los datos no violen restricciones de unicidad o claves foráneas.");
        persona.Id = id;
        return CreatedAtAction(nameof(GetById), new { id }, persona);
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Persona persona, CancellationToken ct)
    {
        if (id != persona.Id) return BadRequest();
        var ok = await _personaRepository.UpdateAsync(persona, ct);
        return ok > 0 ? NoContent() : NotFound();
    }

    }
}
