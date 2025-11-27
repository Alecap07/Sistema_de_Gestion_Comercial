using DevolucionesService.Application.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DevolucionesService.Application.Services
{
    public interface IDevolucionesVentaService
    {
        Task<int> CreateAsync(DevolucionVentaCreateDTO dto);
        Task<DevolucionVentaReadDTO?> GetByIdAsync(int id);
        Task<IEnumerable<DevolucionVentaReadDTO>> ListAsync(bool includeInactive);
        Task UpdateAsync(int id, DevolucionVentaUpdateDTO dto);
        Task CancelAsync(int id);
    }
}
