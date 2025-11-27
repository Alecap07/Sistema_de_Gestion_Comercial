// placeholder
using FacturasService.Application.DTOs;
using FacturasService.Application.Interfaces;
using FacturasService.Common.Enums;
using FacturasService.Domain.Entities;
using FacturasService.Domain.Interfaces;
using FacturasService.Mappers;

namespace FacturasService.Application.Services;

public sealed class FacturaCompraService : IFacturaCompraService
{
    private readonly IFacturaCompraRepository _repo;
    public FacturaCompraService(IFacturaCompraRepository repo) => _repo = repo;

    public async Task<FacturaCompraDTO?> GetByIdAsync(int id, CancellationToken ct = default)
        => (await _repo.GetByIdAsync(id, ct))?.ToDto();

    public async Task<IEnumerable<FacturaCompraDTO>> SearchAsync(
        int? proveedorId,
        string? numeroFactura,
        DateTime? fechaDesde,
        DateTime? fechaHasta,
        EstadoFiltro estadoFiltro = EstadoFiltro.Activos,
        CancellationToken ct = default
    ) => (await _repo.SearchAsync(proveedorId, numeroFactura, fechaDesde, fechaHasta, estadoFiltro, ct)).Select(x => x.ToDto());

    public Task<int> CreateAsync(FacturaCompraCreateDTO dto, CancellationToken ct = default)
        => _repo.CreateAsync(dto.ToEntity(), ct);

    public Task UpdateAsync(int id, FacturaCompraUpdateDTO dto, CancellationToken ct = default)
    {
        var entity = dto.ToEntity();
        entity.Id = id;
        return _repo.UpdateAsync(id, entity, ct);
    }
}