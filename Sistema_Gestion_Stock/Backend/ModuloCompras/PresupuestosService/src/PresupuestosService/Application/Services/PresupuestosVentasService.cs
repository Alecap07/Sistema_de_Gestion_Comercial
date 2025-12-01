using PresupuestosService.Application.DTOs;
using PresupuestosService.Application.Mapping;
using PresupuestosService.Common;
using PresupuestosService.Domain.Entities;
using PresupuestosService.Domain.Repositories;

namespace PresupuestosService.Application.Services;

public class PresupuestosVentasService : IPresupuestosVentasService
{
    private readonly IPresupuestosVentasRepository _repo;
    private readonly IPresupuestosVentasItemsRepository _itemsRepo;

    public PresupuestosVentasService(
        IPresupuestosVentasRepository repo,
        IPresupuestosVentasItemsRepository itemsRepo)
    {
        _repo = repo;
        _itemsRepo = itemsRepo;
    }

    public async Task<Result<int>> CreateAsync(PresupuestoVentaCreateDto dto)
    {
        var entity = dto.ToEntity();
        var id = await _repo.CreateAsync(entity);
        return Result<int>.Ok(id);
    }

    public async Task<Result<PresupuestoVentaReadDto>> GetByIdAsync(int id)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity is null)
            return Result<PresupuestoVentaReadDto>.Fail("Presupuesto no encontrado");

        var items = await _itemsRepo.ListByPresupuestoAsync(entity.Id);
        entity.Items = items.ToList();
        return Result<PresupuestoVentaReadDto>.Ok(entity.ToReadDto());
    }

    public async Task<Result<IReadOnlyList<PresupuestoVentaReadDto>>> ListAsync(bool includeInactive)
    {
        var list = await _repo.ListAllAsync(includeInactive);
        foreach (var p in list)
        {
            var items = await _itemsRepo.ListByPresupuestoAsync(p.Id);
            p.Items = items.ToList();
        }
        var mapped = list.Select(p => p.ToReadDto()).ToList();
        return Result<IReadOnlyList<PresupuestoVentaReadDto>>.Ok(mapped);
    }

    public async Task<Result<bool>> UpdateAsync(int id, PresupuestoVentaUpdateDto dto)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity is null)
            return Result<bool>.Fail("No se encontró el presupuesto.");

        entity.ApplyUpdate(dto);
        var ok = await _repo.UpdateAsync(entity);

        return ok
            ? Result<bool>.Ok(true)
            : Result<bool>.Fail("Error al actualizar en base de datos.");
    }

    public async Task<Result<bool>> CancelAsync(int id)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity is null)
            return Result<bool>.Fail("No se encontró el presupuesto.");

        if (!entity.Activo)
            return Result<bool>.Ok(true); 
        var ok = await _repo.SoftDeleteAsync(id);
        return ok
            ? Result<bool>.Ok(true)
            : Result<bool>.Fail("Error al cancelar en base de datos.");
    }
}