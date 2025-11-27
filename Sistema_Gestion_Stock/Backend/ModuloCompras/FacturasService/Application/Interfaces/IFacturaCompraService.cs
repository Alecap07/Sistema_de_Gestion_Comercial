// placeholder
using FacturasService.Application.DTOs;
using FacturasService.Common.Enums;

namespace FacturasService.Application.Interfaces;

public interface IFacturaCompraService
{
    Task<FacturaCompraDTO?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<FacturaCompraDTO>> SearchAsync(
        int? proveedorId,
        string? numeroFactura,
        DateTime? fechaDesde,
        DateTime? fechaHasta,
        EstadoFiltro estadoFiltro = EstadoFiltro.Activos,
        CancellationToken ct = default
    );
    Task<int> CreateAsync(FacturaCompraCreateDTO dto, CancellationToken ct = default);
    Task UpdateAsync(int id, FacturaCompraUpdateDTO dto, CancellationToken ct = default);
}