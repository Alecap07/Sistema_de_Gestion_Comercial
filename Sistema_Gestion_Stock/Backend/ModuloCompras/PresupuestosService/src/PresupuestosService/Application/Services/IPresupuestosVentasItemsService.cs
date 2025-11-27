using PresupuestosService.Application.DTOs;
using PresupuestosService.Common;

namespace PresupuestosService.Application.Services;

public interface IPresupuestosVentasItemsService
{
    Task<Result<int>> CreateAsync(PresupuestoVentaItemCreateDto dto);
    Task<Result<PresupuestoVentaItemReadDto>> GetByIdAsync(int id);
    Task<Result<IReadOnlyList<PresupuestoVentaItemReadDto>>> ListByPresupuestoAsync(int presupuestoVentaId);
    Task<Result<bool>> UpdateAsync(int id, PresupuestoVentaItemUpdateDto dto);
    Task<Result<bool>> CancelAsync(int id); // soft delete (Activo = 0)
}