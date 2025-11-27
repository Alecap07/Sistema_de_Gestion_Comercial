// placeholder
using FacturasService.Application.DTOs;
using FacturasService.Common.Enums;

namespace FacturasService.Application.Interfaces;

public interface INotaCreditoService
{
    Task<NotaCreditoDTO?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<NotaCreditoDTO>> SearchAsync(
        int? proveedorId,
        int? facturaId,
        DateTime? fechaDesde,
        DateTime? fechaHasta,
        EstadoFiltro estadoFiltro = EstadoFiltro.Activos,
        CancellationToken ct = default
    );
    Task<int> CreateAsync(NotaCreditoCreateDTO dto, CancellationToken ct = default);
    Task UpdateAsync(int id, NotaCreditoUpdateDTO dto, CancellationToken ct = default);
}