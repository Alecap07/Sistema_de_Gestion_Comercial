// placeholder
using FacturasService.Application.DTOs;
using FacturasService.Common.Enums;

namespace FacturasService.Application.Interfaces;

public interface INotaDebitoService
{
    Task<NotaDebitoDTO?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<NotaDebitoDTO>> SearchAsync(
        int? proveedorId,
        int? facturaId,
        DateTime? fechaDesde,
        DateTime? fechaHasta,
        EstadoFiltro estadoFiltro = EstadoFiltro.Activos,
        CancellationToken ct = default
    );
    Task<int> CreateAsync(NotaDebitoCreateDTO dto, CancellationToken ct = default);
    Task UpdateAsync(int id, NotaDebitoUpdateDTO dto, CancellationToken ct = default);
}