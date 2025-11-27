// placeholder
using FacturasService.Application.DTOs;
using FacturasService.Application.Interfaces;
using FacturasService.Common.Enums;
using FacturasService.Domain.Entities;
using FacturasService.Domain.Interfaces;
using FacturasService.Mappers;

namespace FacturasService.Application.Services;

public sealed class FacturaCompraRemitoService : IFacturaCompraRemitoService
{
    private readonly IFacturaCompraRemitoRepository _repo;
    public FacturaCompraRemitoService(IFacturaCompraRemitoRepository repo) => _repo = repo;

    public async Task<FacturaCompraRemitoDTO?> GetByIdAsync(int id, CancellationToken ct = default)
        => (await _repo.GetByIdAsync(id, ct))?.ToDto();

    public async Task<IEnumerable<FacturaCompraRemitoDTO>> SearchAsync(
        int? facturaId,
        int? remitoId,
        EstadoFiltro estadoFiltro = EstadoFiltro.Activos,
        CancellationToken ct = default
    ) => (await _repo.SearchAsync(facturaId, remitoId, estadoFiltro, ct)).Select(x => x.ToDto());

    public Task<int> CreateAsync(FacturaCompraRemitoCreateDTO dto, CancellationToken ct = default)
        => _repo.CreateAsync(dto.ToEntity(), ct);

    public Task UpdateAsync(int id, FacturaCompraRemitoUpdateDTO dto, CancellationToken ct = default)
    {
        var entity = dto.ToEntity();
        entity.Id = id;
        return _repo.UpdateAsync(id, entity, ct);
    }
}