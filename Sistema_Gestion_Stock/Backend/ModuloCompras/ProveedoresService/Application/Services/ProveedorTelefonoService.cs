using ProveedoresService.Application.DTOs;
using ProveedoresService.Application.Interfaces;
using ProveedoresService.Common.Enums;
using ProveedoresService.Domain.Entities;
using ProveedoresService.Domain.Interfaces;
using ProveedoresService.Mappers;

namespace ProveedoresService.Application.Services;

public sealed class ProveedorTelefonoService : IProveedorTelefonoService
{
    private readonly IProveedorTelefonoRepository _repo;
    public ProveedorTelefonoService(IProveedorTelefonoRepository repo) => _repo = repo;

    public async Task<IEnumerable<ProveedorTelefonoDTO>> GetByProveedorAsync(int proveedorId, EstadoFiltro estado, CancellationToken ct = default)
        => (await _repo.GetByProveedorAsync(proveedorId, estado, ct)).Select(x => x.ToDto());

    public async Task<ProveedorTelefonoDTO?> GetByIdAsync(int id, CancellationToken ct = default)
        => (await _repo.GetByIdAsync(id, ct))?.ToDto();

    public async Task<int> CreateAsync(int proveedorId, ProveedorTelefonoCreateDTO dto, CancellationToken ct = default)
    {
        var entity = dto.ToEntity();
        entity.ProveedorId = proveedorId;
        var newId = await _repo.CreateAsync(proveedorId, entity, ct);
        return newId;
    }

    public Task UpdateAsync(int id, ProveedorTelefonoUpdateDTO dto, CancellationToken ct = default)
    {
        var entity = dto.ToEntity();
        entity.Id = id;
        return _repo.UpdateAsync(id, entity, ct);
    }
}