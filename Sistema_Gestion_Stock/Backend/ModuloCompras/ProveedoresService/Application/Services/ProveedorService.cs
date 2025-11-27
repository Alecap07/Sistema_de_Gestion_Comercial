using ProveedoresService.Application.DTOs;
using ProveedoresService.Application.Interfaces;
using ProveedoresService.Common.Enums;
using ProveedoresService.Domain.Interfaces;
using ProveedoresService.Mappers;

namespace ProveedoresService.Application.Services;

public sealed class ProveedorService : IProveedorService
{
    private readonly IProveedorRepository _repo;
    public ProveedorService(IProveedorRepository repo) => _repo = repo;

    public async Task<ProveedorDTO?> GetByIdAsync(int id, CancellationToken ct = default)
        => (await _repo.GetByIdAsync(id, ct))?.ToDto();

    public async Task<ProveedorDTO?> GetByCodigoAsync(string codigo, CancellationToken ct = default)
        => (await _repo.GetByCodigoAsync(codigo, ct))?.ToDto();

    public async Task<IEnumerable<ProveedorDTO>> SearchAsync(
        string? razonSocial, string? codigo, int? personaId, EstadoFiltro estado = EstadoFiltro.Activos, CancellationToken ct = default)
        => (await _repo.SearchAsync(razonSocial, codigo, personaId, estado, ct)).Select(x => x.ToDto());

    public Task<int> CreateAsync(ProveedorCreateDTO dto, CancellationToken ct = default)
        => _repo.CreateAsync(dto.ToEntity(), ct);

    public Task UpdateAsync(int id, ProveedorUpdateDTO dto, CancellationToken ct = default)
        => _repo.UpdateAsync(dto.ToEntity(id), ct);
}