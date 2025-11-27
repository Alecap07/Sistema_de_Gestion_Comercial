using NotasCreditoService.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NotasCreditoService.Domain.IRepositories
{
    public interface INotasCreditoVentasRepository
    {
        Task<int> CreateAsync(NotaCreditoVenta entity);
        Task<NotaCreditoVenta?> GetByIdAsync(int id);
        Task<IEnumerable<NotaCreditoVenta>> ListAsync();
        Task UpdateAsync(int id, NotaCreditoVenta entity);
        Task CancelAsync(int id);
    }
}
