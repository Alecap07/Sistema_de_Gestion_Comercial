using ProductosService.Application.DTOs;
using ProductosService.Application.Interfaces;
using ProductosService.Common.Enums;
using ProductosService.Domain.Interfaces;
using ProductosService.Mappers;

namespace ProductosService.Application.Services;

public sealed class MarcaService : IMarcaService
{
    private readonly IMarcaRepository _repo;

    public MarcaService(IMarcaRepository repo) => _repo = repo;

    public async Task<MarcaDTO?> GetByIdAsync(int id, CancellationToken ct = default)
        => (await _repo.GetByIdAsync(id, ct))?.ToDto();

    public async Task<IEnumerable<MarcaDTO>> GetAllAsync(EstadoFiltro estado = EstadoFiltro.Activos, CancellationToken ct = default)
        => (await _repo.GetAllAsync(estado, ct)).Select(m => m.ToDto());

    public Task<int> CreateAsync(MarcaCreateDTO dto, CancellationToken ct = default)
        => _repo.CreateAsync(dto.ToEntity(), ct);

    public Task UpdateAsync(int id, MarcaUpdateDTO dto, CancellationToken ct = default)
        => _repo.UpdateAsync(dto.ToEntity(id), ct);
}