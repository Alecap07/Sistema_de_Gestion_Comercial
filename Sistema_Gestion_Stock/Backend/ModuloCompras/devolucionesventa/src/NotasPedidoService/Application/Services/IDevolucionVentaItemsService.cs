using DevolucionesService.Application.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DevolucionesService.Application.Services
{
    public interface IDevolucionVentaItemsService
    {
        Task<int> CreateAsync(DevolucionVentaItemCreateDTO dto);
        Task<DevolucionVentaItemReadDTO?> GetByIdAsync(int id);
        Task<IEnumerable<DevolucionVentaItemReadDTO>> ListByDevolucionAsync(int devolucionVentaId, bool includeInactive);
        Task UpdateAsync(int id, DevolucionVentaItemUpdateDTO dto);
        Task CancelAsync(int id);
    }
}
