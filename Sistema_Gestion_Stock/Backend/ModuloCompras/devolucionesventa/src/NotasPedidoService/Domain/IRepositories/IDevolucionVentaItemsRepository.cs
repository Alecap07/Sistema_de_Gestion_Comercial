using DevolucionesService.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DevolucionesService.Domain.IRepositories
{
    public interface IDevolucionVentaItemsRepository
    {
        Task<int> CreateAsync(DevolucionVentaItem entity);
        Task<DevolucionVentaItem?> GetByIdAsync(int id);
        Task<IEnumerable<DevolucionVentaItem>> ListByDevolucionAsync(int devolucionVentaId, bool includeInactive);
        Task UpdateAsync(int id, DevolucionVentaItem entity);
        Task CancelAsync(int id);
    }
}
