using ProveedoresService.Application.DTOs;
using ProveedoresService.Application.Interfaces;
using ProveedoresService.Common.Enums;
using ProveedoresService.Domain.Entities;
using ProveedoresService.Domain.Interfaces;
using ProveedoresService.Mappers;

namespace ProveedoresService.Application.Services;

public sealed class CategoriaService : ICategoriaService
{
    private readonly ICategoriaRepository _repo;
    public CategoriaService(ICategoriaRepository repo) => _repo = repo;

    public async Task<CategoriaDTO?> GetByIdAsync(int id, CancellationToken ct = default)
        => (await _repo.GetByIdAsync(id, ct))?.ToDto();

    public async Task<IEnumerable<CategoriaDTO>> SearchAsync(string? nombre, EstadoFiltro estado = EstadoFiltro.Activos, CancellationToken ct = default)
        => (await _repo.SearchAsync(nombre, estado, ct)).Select(x => x.ToDto());

    public Task<int> CreateAsync(CategoriaCreateDTO dto, CancellationToken ct = default)
        => _repo.CreateAsync(dto.ToEntity(), ct);

    public Task UpdateAsync(int id, CategoriaUpdateDTO dto, CancellationToken ct = default)
    {
        var entity = dto.ToEntity();
        entity.Id = id;
        return _repo.UpdateAsync(id, entity, ct);
    }
}