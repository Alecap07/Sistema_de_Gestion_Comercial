using RemitosService.Application.DTOs;
using RemitosService.Application.Interfaces;
using RemitosService.Common.Enums;
using RemitosService.Domain.Entities;
using RemitosService.Domain.Interfaces;
using RemitosService.Mappers;

namespace RemitosService.Application.Services;

public sealed class DevolucionProveedorService : IDevolucionProveedorService
{
    private readonly IDevolucionProveedorRepository _repo;
    public DevolucionProveedorService(IDevolucionProveedorRepository repo) => _repo = repo;

    public async Task<DevolucionProveedorDTO?> GetByIdAsync(int id, CancellationToken ct = default)
        => (await _repo.GetByIdAsync(id, ct))?.ToDto();

    public async Task<IEnumerable<DevolucionProveedorDTO>> SearchAsync(
        int? proveedorId,
        DateTime? fechaDesde,
        DateTime? fechaHasta,
        EstadoFiltro estadoFiltro = EstadoFiltro.Activos,
        CancellationToken ct = default
    ) => (await _repo.SearchAsync(proveedorId, fechaDesde, fechaHasta, estadoFiltro, ct)).Select(x => x.ToDto());

    public Task<int> CreateAsync(DevolucionProveedorCreateDTO dto, CancellationToken ct = default)
        => _repo.CreateAsync(dto.ToEntity(), ct);

    public Task UpdateAsync(int id, DevolucionProveedorUpdateDTO dto, CancellationToken ct = default)
    {
        var entity = dto.ToEntity();
        entity.Id = id;
        return _repo.UpdateAsync(id, entity, ct);
    }
}