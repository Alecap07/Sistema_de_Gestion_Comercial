using NotasDebitoService.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NotasDebitoService.Domain.IRepositories
{
    public interface INotasDebitoVentasRepository
    {
        Task<int> CreateAsync(NotaDebitoVenta entity);
        Task<NotaDebitoVenta?> GetByIdAsync(int id);
        Task<IEnumerable<NotaDebitoVenta>> ListAsync(bool includeInactive);
        Task UpdateAsync(int id, NotaDebitoVenta entity);
        Task CancelAsync(int id);
    }
}
