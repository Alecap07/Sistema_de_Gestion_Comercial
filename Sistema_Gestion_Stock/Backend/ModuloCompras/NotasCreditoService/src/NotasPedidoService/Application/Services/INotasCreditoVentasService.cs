using NotasCreditoService.Application.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NotasCreditoService.Application.Services
{
    public interface INotasCreditoVentasService
    {
        Task<int> CreateAsync(NotaCreditoVentaCreateDTO dto);
        Task<NotaCreditoVentaReadDTO?> GetByIdAsync(int id);
        Task<IEnumerable<NotaCreditoVentaReadDTO>> ListAsync();
        Task UpdateAsync(int id, NotaCreditoVentaUpdateDTO dto);
        Task CancelAsync(int id);
    }
}
