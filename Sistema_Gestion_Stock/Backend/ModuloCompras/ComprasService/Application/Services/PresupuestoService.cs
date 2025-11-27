using ComprasService.Application.DTOs;
using ComprasService.Application.Interfaces;
using ComprasService.Common.Enums;
using ComprasService.Domain.Entities;
using ComprasService.Domain.Interfaces;
using ComprasService.Mappers;

namespace ComprasService.Application.Services;

public sealed class PresupuestoService : IPresupuestoService
{
    private readonly IPresupuestoRepository _repo;
    public PresupuestoService(IPresupuestoRepository repo) => _repo = repo;

    public async Task<PresupuestoDTO?> GetByIdAsync(int id, CancellationToken ct = default)
        => (await _repo.GetByIdAsync(id, ct))?.ToDto();

    public async Task<IEnumerable<PresupuestoDTO>> SearchAsync(
        int? proveedorId,
        string? estado,
        DateTime? fechaDesde,
        DateTime? fechaHasta,
        EstadoFiltro estadoFiltro = EstadoFiltro.Activos,
        CancellationToken ct = default
    ) => (await _repo.SearchAsync(proveedorId, estado, fechaDesde, fechaHasta, estadoFiltro, ct)).Select(x => x.ToDto());

    public Task<int> CreateAsync(PresupuestoCreateDTO dto, CancellationToken ct = default)
        => _repo.CreateAsync(dto.ToEntity(), ct);

    public Task UpdateAsync(int id, PresupuestoUpdateDTO dto, CancellationToken ct = default)
    {
        var entity = dto.ToEntity();
        entity.Id = id;
        return _repo.UpdateAsync(id, entity, ct);
    }
}