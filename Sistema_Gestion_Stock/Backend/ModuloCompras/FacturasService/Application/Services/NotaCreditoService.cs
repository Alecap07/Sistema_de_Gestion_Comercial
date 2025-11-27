// placeholder
using FacturasService.Application.DTOs;
using FacturasService.Application.Interfaces;
using FacturasService.Common.Enums;
using FacturasService.Domain.Entities;
using FacturasService.Domain.Interfaces;
using FacturasService.Mappers;

namespace FacturasService.Application.Services;

public sealed class NotaCreditoService : INotaCreditoService
{
    private readonly INotaCreditoRepository _repo;
    public NotaCreditoService(INotaCreditoRepository repo) => _repo = repo;

    public async Task<NotaCreditoDTO?> GetByIdAsync(int id, CancellationToken ct = default)
        => (await _repo.GetByIdAsync(id, ct))?.ToDto();

    public async Task<IEnumerable<NotaCreditoDTO>> SearchAsync(
        int? proveedorId,
        int? facturaId,
        DateTime? fechaDesde,
        DateTime? fechaHasta,
        EstadoFiltro estadoFiltro = EstadoFiltro.Activos,
        CancellationToken ct = default
    ) => (await _repo.SearchAsync(proveedorId, facturaId, fechaDesde, fechaHasta, estadoFiltro, ct)).Select(x => x.ToDto());

    public Task<int> CreateAsync(NotaCreditoCreateDTO dto, CancellationToken ct = default)
        => _repo.CreateAsync(dto.ToEntity(), ct);

    public Task UpdateAsync(int id, NotaCreditoUpdateDTO dto, CancellationToken ct = default)
    {
        var entity = dto.ToEntity();
        entity.Id = id;
        return _repo.UpdateAsync(id, entity, ct);
    }
}