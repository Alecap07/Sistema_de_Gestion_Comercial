using PresupuestosService.Application.DTOs;
using PresupuestosService.Common;

namespace PresupuestosService.Application.Services;

public interface IPresupuestosVentasService
{
    Task<Result<int>> CreateAsync(PresupuestoVentaCreateDto dto);
    Task<Result<PresupuestoVentaReadDto>> GetByIdAsync(int id);
    Task<Result<IReadOnlyList<PresupuestoVentaReadDto>>> ListAsync(bool includeInactive);
    Task<Result<bool>> UpdateAsync(int id, PresupuestoVentaUpdateDto dto);
    Task<Result<bool>> CancelAsync(int id); // soft delete
}