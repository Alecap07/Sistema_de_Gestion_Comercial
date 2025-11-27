using PresupuestosService.Application.DTOs;
using PresupuestosService.Application.Mapping;
using PresupuestosService.Common;
using PresupuestosService.Domain.Repositories;

namespace PresupuestosService.Application.Services;

public class PresupuestosVentasItemsService : IPresupuestosVentasItemsService
{
    private readonly IPresupuestosVentasItemsRepository _repo;

    public PresupuestosVentasItemsService(IPresupuestosVentasItemsRepository repo)
    {
        _repo = repo;
    }

    public async Task<Result<int>> CreateAsync(PresupuestoVentaItemCreateDto dto)
    {
        var entity = dto.ToEntity();
        var id = await _repo.CreateAsync(entity);
        return Result<int>.Ok(id);
    }

    public async Task<Result<PresupuestoVentaItemReadDto>> GetByIdAsync(int id)
    {
        var item = await _repo.GetByIdAsync(id);
        return item is null
            ? Result<PresupuestoVentaItemReadDto>.Fail("Item no encontrado")
            : Result<PresupuestoVentaItemReadDto>.Ok(item.ToReadDto());
    }

    public async Task<Result<IReadOnlyList<PresupuestoVentaItemReadDto>>> ListByPresupuestoAsync(int presupuestoVentaId)
    {
        var items = await _repo.ListByPresupuestoAsync(presupuestoVentaId);
        var mapped = items.Select(i => i.ToReadDto()).ToList();
        return Result<IReadOnlyList<PresupuestoVentaItemReadDto>>.Ok(mapped);
    }

    public async Task<Result<bool>> UpdateAsync(int id, PresupuestoVentaItemUpdateDto dto)
    {
        var item = await _repo.GetByIdAsync(id);
        if (item is null)
            return Result<bool>.Fail("Item no encontrado");

        item.ApplyUpdate(dto);
        var ok = await _repo.UpdateAsync(item);
        return ok ? Result<bool>.Ok(true) : Result<bool>.Fail("Error al actualizar el item.");
    }

    public async Task<Result<bool>> CancelAsync(int id)
    {
        var item = await _repo.GetByIdAsync(id);
        if (item is null)
            return Result<bool>.Fail("Item no encontrado");

        if (!item.Activo)
            return Result<bool>.Ok(true);

        var ok = await _repo.SoftDeleteAsync(id);
        return ok ? Result<bool>.Ok(true) : Result<bool>.Fail("Error al cancelar el item.");
    }
}