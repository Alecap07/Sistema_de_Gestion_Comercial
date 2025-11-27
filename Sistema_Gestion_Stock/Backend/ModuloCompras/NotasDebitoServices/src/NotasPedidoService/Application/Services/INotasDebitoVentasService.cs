using NotasDebitoService.Application.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NotasDebitoService.Application.Services
{
    public interface INotasDebitoVentasService
    {
        Task<int> CreateAsync(NotaDebitoVentaCreateDTO dto);
        Task<NotaDebitoVentaReadDTO?> GetByIdAsync(int id);
        Task<IEnumerable<NotaDebitoVentaReadDTO>> ListAsync(bool includeInactive);
        Task UpdateAsync(int id, NotaDebitoVentaUpdateDTO dto);
        Task CancelAsync(int id);
    }
}
