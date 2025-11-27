using Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IRestriccionRepository
    {
        Task<IEnumerable<Restriccion>> GetAllAsync();
        Task<Restriccion?> GetByIdAsync(int id);
        Task UpdateAsync(Restriccion restriccion);
    }
}
