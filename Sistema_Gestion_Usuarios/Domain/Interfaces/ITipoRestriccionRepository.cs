using Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface ITipoRestriccionRepository
    {
        Task<IEnumerable<TipoRestriccion>> GetAllAsync();
    }
}
