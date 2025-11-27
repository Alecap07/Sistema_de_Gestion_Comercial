using DevolucionesService.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DevolucionesService.Domain.IRepositories
{
    public interface IDevolucionesVentaRepository
    {
        Task<int> CreateAsync(DevolucionVenta entity);
        Task<DevolucionVenta?> GetByIdAsync(int id);
        Task<IEnumerable<DevolucionVenta>> ListAsync(bool includeInactive);
        Task UpdateAsync(int id, DevolucionVenta entity);
        Task CancelAsync(int id);
    }
}
