using ComprasService.Application.DTOs;
using ComprasService.Common.Enums;

namespace ComprasService.Application.Interfaces;

public interface IPresupuestoItemService
{
    Task<PresupuestoItemDTO?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<PresupuestoItemDTO>> SearchAsync(
        int? presupuestoId,
        EstadoFiltro estadoFiltro = EstadoFiltro.Activos,
        CancellationToken ct = default
    );
    Task<int> CreateAsync(PresupuestoItemCreateDTO dto, CancellationToken ct = default);
    Task UpdateAsync(int id, PresupuestoItemUpdateDTO dto, CancellationToken ct = default);
}