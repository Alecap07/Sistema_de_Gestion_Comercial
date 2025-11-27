using ComprasService.Application.DTOs;
using ComprasService.Common.Enums;

namespace ComprasService.Application.Interfaces;

public interface IOrdenCompraItemService
{
    Task<OrdenCompraItemDTO?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<OrdenCompraItemDTO>> SearchAsync(
        int? ordenCompraId,
        EstadoFiltro estadoFiltro = EstadoFiltro.Activos,
        CancellationToken ct = default
    );
    Task<int> CreateAsync(OrdenCompraItemCreateDTO dto, CancellationToken ct = default);
    Task UpdateAsync(int id, OrdenCompraItemUpdateDTO dto, CancellationToken ct = default);
}