using ProveedoresService.Application.DTOs;
using ProveedoresService.Application.Interfaces;
using ProveedoresService.Common.Enums;
using ProveedoresService.Domain.Entities;
using ProveedoresService.Domain.Interfaces;
using ProveedoresService.Mappers;

namespace ProveedoresService.Application.Services;

public sealed class ProveedorCategoriaService : IProveedorCategoriaService
{
    private readonly IProveedorCategoriaRepository _repo;
    public ProveedorCategoriaService(IProveedorCategoriaRepository repo) => _repo = repo;

    public async Task<IEnumerable<ProveedorCategoriaDTO>> GetByProveedorAsync(int proveedorId, EstadoFiltro estado, CancellationToken ct = default)
        => (await _repo.GetByProveedorAsync(proveedorId, estado, ct)).Select(x => x.ToDto());

    public async Task<ProveedorCategoriaDTO?> GetByIdAsync(int id, CancellationToken ct = default)
        => (await _repo.GetByIdAsync(id, ct))?.ToDto();

    public async Task<int> CreateAsync(int proveedorId, ProveedorCategoriaCreateDTO dto, CancellationToken ct = default)
    {
        var entity = dto.ToEntity();
        entity.ProveedorId = proveedorId;
        return await _repo.CreateAsync(proveedorId, entity, ct);
    }

    public Task UpdateAsync(int id, ProveedorCategoriaUpdateDTO dto, CancellationToken ct = default)
    {
        var entity = dto.ToEntity();
        entity.Id = id;
        return _repo.UpdateAsync(id, entity, ct);
    }
}