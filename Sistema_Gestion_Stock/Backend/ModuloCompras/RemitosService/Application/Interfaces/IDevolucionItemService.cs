using RemitosService.Application.DTOs;
using RemitosService.Common.Enums;

namespace RemitosService.Application.Interfaces;

public interface IDevolucionItemService
{
    Task<DevolucionItemDTO?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<DevolucionItemDTO>> SearchAsync(
        int? devolucionId,
        EstadoFiltro estadoFiltro = EstadoFiltro.Activos,
        CancellationToken ct = default
    );
    Task<int> CreateAsync(DevolucionItemCreateDTO dto, CancellationToken ct = default);
    Task UpdateAsync(int id, DevolucionItemUpdateDTO dto, CancellationToken ct = default);
}