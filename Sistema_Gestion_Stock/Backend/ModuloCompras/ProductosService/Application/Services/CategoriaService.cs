using ProductosService.Application.DTOs;
using ProductosService.Application.Interfaces;
using ProductosService.Common.Enums;
using ProductosService.Domain.Interfaces;
using ProductosService.Mappers;

namespace ProductosService.Application.Services;

public sealed class CategoriaService : ICategoriaService
{
    private readonly ICategoriaRepository _repo;

    public CategoriaService(ICategoriaRepository repo) => _repo = repo;

    public async Task<CategoriaDTO?> GetByIdAsync(int id, CancellationToken ct = default)
        => (await _repo.GetByIdAsync(id, ct))?.ToDto();

    public async Task<IEnumerable<CategoriaDTO>> GetAllAsync(EstadoFiltro estado = EstadoFiltro.Activos, CancellationToken ct = default)
        => (await _repo.GetAllAsync(estado, ct)).Select(c => c.ToDto());

    public Task<int> CreateAsync(CategoriaCreateDTO dto, CancellationToken ct = default)
        => _repo.CreateAsync(dto.ToEntity(), ct);

    public Task UpdateAsync(int id, CategoriaUpdateDTO dto, CancellationToken ct = default)
        => _repo.UpdateAsync(dto.ToEntity(id), ct);
}