using ComprasService.Application.DTOs;
using ComprasService.Application.Interfaces;
using ComprasService.Common.Enums;
using ComprasService.Domain.Entities;
using ComprasService.Domain.Interfaces;
using ComprasService.Mappers;

namespace ComprasService.Application.Services;

public sealed class OrdenCompraItemService : IOrdenCompraItemService
{
    private readonly IOrdenCompraItemRepository _repo;
    public OrdenCompraItemService(IOrdenCompraItemRepository repo) => _repo = repo;

    public async Task<OrdenCompraItemDTO?> GetByIdAsync(int id, CancellationToken ct = default)
        => (await _repo.GetByIdAsync(id, ct))?.ToDto();

    public async Task<IEnumerable<OrdenCompraItemDTO>> SearchAsync(
        int? ordenCompraId,
        EstadoFiltro estadoFiltro = EstadoFiltro.Activos,
        CancellationToken ct = default
    ) => (await _repo.SearchAsync(ordenCompraId, estadoFiltro, ct)).Select(x => x.ToDto());

    public Task<int> CreateAsync(OrdenCompraItemCreateDTO dto, CancellationToken ct = default)
        => _repo.CreateAsync(dto.ToEntity(), ct);

    public Task UpdateAsync(int id, OrdenCompraItemUpdateDTO dto, CancellationToken ct = default)
    {
        var entity = dto.ToEntity();
        entity.Id = id;
        return _repo.UpdateAsync(id, entity, ct);
    }
}