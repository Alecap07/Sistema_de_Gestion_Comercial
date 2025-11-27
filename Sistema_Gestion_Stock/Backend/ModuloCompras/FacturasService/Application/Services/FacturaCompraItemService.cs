// placeholder
using FacturasService.Application.DTOs;
using FacturasService.Application.Interfaces;
using FacturasService.Common.Enums;
using FacturasService.Domain.Entities;
using FacturasService.Domain.Interfaces;
using FacturasService.Mappers;

namespace FacturasService.Application.Services;

public sealed class FacturaCompraItemService : IFacturaCompraItemService
{
    private readonly IFacturaCompraItemRepository _repo;
    public FacturaCompraItemService(IFacturaCompraItemRepository repo) => _repo = repo;

    public async Task<FacturaCompraItemDTO?> GetByIdAsync(int id, CancellationToken ct = default)
        => (await _repo.GetByIdAsync(id, ct))?.ToDto();

    public async Task<IEnumerable<FacturaCompraItemDTO>> SearchAsync(
        int? facturaId,
        EstadoFiltro estadoFiltro = EstadoFiltro.Activos,
        CancellationToken ct = default
    ) => (await _repo.SearchAsync(facturaId, estadoFiltro, ct)).Select(x => x.ToDto());

    public Task<int> CreateAsync(FacturaCompraItemCreateDTO dto, CancellationToken ct = default)
        => _repo.CreateAsync(dto.ToEntity(), ct);

    public Task UpdateAsync(int id, FacturaCompraItemUpdateDTO dto, CancellationToken ct = default)
    {
        var entity = dto.ToEntity();
        entity.Id = id;
        return _repo.UpdateAsync(id, entity, ct);
    }
}