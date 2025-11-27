using RemitosService.Application.DTOs;
using RemitosService.Common.Enums;

namespace RemitosService.Application.Interfaces;

public interface IDevolucionProveedorService
{
    Task<DevolucionProveedorDTO?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<DevolucionProveedorDTO>> SearchAsync(
        int? proveedorId,
        DateTime? fechaDesde,
        DateTime? fechaHasta,
        EstadoFiltro estadoFiltro = EstadoFiltro.Activos,
        CancellationToken ct = default
    );
    Task<int> CreateAsync(DevolucionProveedorCreateDTO dto, CancellationToken ct = default);
    Task UpdateAsync(int id, DevolucionProveedorUpdateDTO dto, CancellationToken ct = default);
}