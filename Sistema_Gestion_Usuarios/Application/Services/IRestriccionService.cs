using Common;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Services
{
    public interface IRestriccionService
    {
        Task<IEnumerable<RestriccionDto>> GetAllAsync();
        Task<RestriccionDto?> GetByIdAsync(int id);
        Task UpdateAsync(RestriccionDto restriccion);
    }
}
