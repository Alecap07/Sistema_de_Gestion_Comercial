using ComprasService.Application.DTOs;
using ComprasService.Application.Interfaces;
using ComprasService.Common.Enums;
using ComprasService.Domain.Entities;
using ComprasService.Domain.Interfaces;
using ComprasService.Mappers;

namespace ComprasService.Application.Services;

public sealed class PresupuestoItemService : IPresupuestoItemService
{
    private readonly IPresupuestoItemRepository _repo;
    public PresupuestoItemService(IPresupuestoItemRepository repo) => _repo = repo;

    public async Task<PresupuestoItemDTO?> GetByIdAsync(int id, CancellationToken ct = default)
        => (await _repo.GetByIdAsync(id, ct))?.ToDto();

    public async Task<IEnumerable<PresupuestoItemDTO>> SearchAsync(
        int? presupuestoId,
        EstadoFiltro estadoFiltro = EstadoFiltro.Activos,
        CancellationToken ct = default
    ) => (await _repo.SearchAsync(presupuestoId, estadoFiltro, ct)).Select(x => x.ToDto());

    public Task<int> CreateAsync(PresupuestoItemCreateDTO dto, CancellationToken ct = default)
        => _repo.CreateAsync(dto.ToEntity(), ct);

    public Task UpdateAsync(int id, PresupuestoItemUpdateDTO dto, CancellationToken ct = default)
    {
        var entity = dto.ToEntity();
        entity.Id = id;
        return _repo.UpdateAsync(id, entity, ct);
    }
}