// placeholder
using FacturasService.Application.DTOs;
using FacturasService.Common.Enums;

namespace FacturasService.Application.Interfaces;

public interface IFacturaCompraItemService
{
    Task<FacturaCompraItemDTO?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<FacturaCompraItemDTO>> SearchAsync(
        int? facturaId,
        EstadoFiltro estadoFiltro = EstadoFiltro.Activos,
        CancellationToken ct = default
    );
    Task<int> CreateAsync(FacturaCompraItemCreateDTO dto, CancellationToken ct = default);
    Task UpdateAsync(int id, FacturaCompraItemUpdateDTO dto, CancellationToken ct = default);
}