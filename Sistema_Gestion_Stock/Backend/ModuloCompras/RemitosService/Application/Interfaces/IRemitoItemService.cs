using RemitosService.Application.DTOs;
using RemitosService.Common.Enums;

namespace RemitosService.Application.Interfaces;

public interface IRemitoItemService
{
    Task<RemitoItemDTO?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<RemitoItemDTO>> SearchAsync(
        int? remitoId,
        EstadoFiltro estadoFiltro = EstadoFiltro.Activos,
        CancellationToken ct = default
    );
    Task<int> CreateAsync(RemitoItemCreateDTO dto, CancellationToken ct = default);
    Task UpdateAsync(int id, RemitoItemUpdateDTO dto, CancellationToken ct = default);
}