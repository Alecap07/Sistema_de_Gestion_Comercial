using ComprasService.Application.DTOs;
using ComprasService.Common.Enums;

namespace ComprasService.Application.Interfaces;

public interface IPresupuestoService
{
    Task<PresupuestoDTO?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<PresupuestoDTO>> SearchAsync(
        int? proveedorId,
        string? estado,
        DateTime? fechaDesde,
        DateTime? fechaHasta,
        EstadoFiltro estadoFiltro = EstadoFiltro.Activos,
        CancellationToken ct = default
    );
    Task<int> CreateAsync(PresupuestoCreateDTO dto, CancellationToken ct = default);
    Task UpdateAsync(int id, PresupuestoUpdateDTO dto, CancellationToken ct = default);
}