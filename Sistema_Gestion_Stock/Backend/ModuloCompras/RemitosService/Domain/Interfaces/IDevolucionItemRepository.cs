using RemitosService.Domain.Entities;
using RemitosService.Common.Enums;

namespace RemitosService.Domain.Interfaces;

public interface IDevolucionItemRepository
{
    Task<DevolucionItem?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<DevolucionItem>> SearchAsync(
        int? devolucionId,
        EstadoFiltro estadoFiltro,
        CancellationToken ct = default
    );
    Task<int> CreateAsync(DevolucionItem entity, CancellationToken ct = default);
    Task UpdateAsync(int id, DevolucionItem entity, CancellationToken ct = default);
}