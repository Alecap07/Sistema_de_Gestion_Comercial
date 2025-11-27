using RemitosService.Domain.Entities;
using RemitosService.Common.Enums;

namespace RemitosService.Domain.Interfaces;

public interface IDevolucionProveedorRepository
{
    Task<DevolucionProveedor?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<DevolucionProveedor>> SearchAsync(
        int? proveedorId,
        DateTime? fechaDesde,
        DateTime? fechaHasta,
        EstadoFiltro estadoFiltro,
        CancellationToken ct = default
    );
    Task<int> CreateAsync(DevolucionProveedor entity, CancellationToken ct = default);
    Task UpdateAsync(int id, DevolucionProveedor entity, CancellationToken ct = default);
}