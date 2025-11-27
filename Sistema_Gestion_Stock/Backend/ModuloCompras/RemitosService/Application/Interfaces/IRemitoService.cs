using RemitosService.Application.DTOs;
using RemitosService.Common.Enums;

namespace RemitosService.Application.Interfaces;

public interface IRemitoService
{
    Task<RemitoDTO?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<RemitoDTO>> SearchAsync(
        int? proveedorId,
        int? ordenCompraId,
        DateTime? fechaDesde,
        DateTime? fechaHasta,
        EstadoFiltro estadoFiltro = EstadoFiltro.Activos,
        CancellationToken ct = default
    );
    Task<int> CreateAsync(RemitoCreateDTO dto, CancellationToken ct = default);
    Task UpdateAsync(int id, RemitoUpdateDTO dto, CancellationToken ct = default);
}