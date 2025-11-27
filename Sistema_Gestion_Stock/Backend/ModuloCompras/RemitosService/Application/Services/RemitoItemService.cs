using RemitosService.Application.DTOs;
using RemitosService.Application.Interfaces;
using RemitosService.Common.Enums;
using RemitosService.Domain.Entities;
using RemitosService.Domain.Interfaces;
using RemitosService.Mappers;

namespace RemitosService.Application.Services;

public sealed class RemitoItemService : IRemitoItemService
{
    private readonly IRemitoItemRepository _repo;
    public RemitoItemService(IRemitoItemRepository repo) => _repo = repo;

    public async Task<RemitoItemDTO?> GetByIdAsync(int id, CancellationToken ct = default)
        => (await _repo.GetByIdAsync(id, ct))?.ToDto();

    public async Task<IEnumerable<RemitoItemDTO>> SearchAsync(
        int? remitoId,
        EstadoFiltro estadoFiltro = EstadoFiltro.Activos,
        CancellationToken ct = default
    ) => (await _repo.SearchAsync(remitoId, estadoFiltro, ct)).Select(x => x.ToDto());

    public Task<int> CreateAsync(RemitoItemCreateDTO dto, CancellationToken ct = default)
        => _repo.CreateAsync(dto.ToEntity(), ct);

    public Task UpdateAsync(int id, RemitoItemUpdateDTO dto, CancellationToken ct = default)
    {
        var entity = dto.ToEntity();
        entity.Id = id;
        return _repo.UpdateAsync(id, entity, ct);
    }
}