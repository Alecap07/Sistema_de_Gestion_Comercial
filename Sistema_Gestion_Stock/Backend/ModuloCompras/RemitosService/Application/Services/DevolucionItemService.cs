using RemitosService.Application.DTOs;
using RemitosService.Application.Interfaces;
using RemitosService.Common.Enums;
using RemitosService.Domain.Entities;
using RemitosService.Domain.Interfaces;
using RemitosService.Mappers;

namespace RemitosService.Application.Services;

public sealed class DevolucionItemService : IDevolucionItemService
{
    private readonly IDevolucionItemRepository _repo;
    public DevolucionItemService(IDevolucionItemRepository repo) => _repo = repo;

    public async Task<DevolucionItemDTO?> GetByIdAsync(int id, CancellationToken ct = default)
        => (await _repo.GetByIdAsync(id, ct))?.ToDto();

    public async Task<IEnumerable<DevolucionItemDTO>> SearchAsync(
        int? devolucionId,
        EstadoFiltro estadoFiltro = EstadoFiltro.Activos,
        CancellationToken ct = default
    ) => (await _repo.SearchAsync(devolucionId, estadoFiltro, ct)).Select(x => x.ToDto());

    public Task<int> CreateAsync(DevolucionItemCreateDTO dto, CancellationToken ct = default)
        => _repo.CreateAsync(dto.ToEntity(), ct);

    public Task UpdateAsync(int id, DevolucionItemUpdateDTO dto, CancellationToken ct = default)
    {
        var entity = dto.ToEntity();
        entity.Id = id;
        return _repo.UpdateAsync(id, entity, ct);
    }
}