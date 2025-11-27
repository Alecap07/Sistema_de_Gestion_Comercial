using ComprasService.Application.DTOs;
using ComprasService.Common.Enums;

namespace ComprasService.Application.Interfaces;

public interface IOrdenCompraService
{
    Task<OrdenCompraDTO?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<OrdenCompraDTO>> SearchAsync(
        int? proveedorId,
        string? estado,
        DateTime? fechaDesde,
        DateTime? fechaHasta,
        EstadoFiltro estadoFiltro = EstadoFiltro.Activos,
        CancellationToken ct = default
    );
    Task<int> CreateAsync(OrdenCompraCreateDTO dto, CancellationToken ct = default);
    Task UpdateAsync(int id, OrdenCompraUpdateDTO dto, CancellationToken ct = default);
}