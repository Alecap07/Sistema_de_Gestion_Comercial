// placeholder
using FacturasService.Application.DTOs;
using FacturasService.Common.Enums;

namespace FacturasService.Application.Interfaces;

public interface IFacturaCompraRemitoService
{
    Task<FacturaCompraRemitoDTO?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<FacturaCompraRemitoDTO>> SearchAsync(
        int? facturaId,
        int? remitoId,
        EstadoFiltro estadoFiltro = EstadoFiltro.Activos,
        CancellationToken ct = default
    );
    Task<int> CreateAsync(FacturaCompraRemitoCreateDTO dto, CancellationToken ct = default);
    Task UpdateAsync(int id, FacturaCompraRemitoUpdateDTO dto, CancellationToken ct = default);
}