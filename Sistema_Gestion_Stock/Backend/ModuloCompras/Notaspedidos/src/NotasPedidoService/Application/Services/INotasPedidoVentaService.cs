using NotasPedidoService.Application.DTOs;
using NotasPedidoService.Domain.Entities;
namespace NotasPedidoService.Application.Services

{
    public interface INotasPedidoVentaService
    {
        Task<int> CreateAsync(NotaPedidoVentaCreateDTO dto);
        Task<NotaPedidoVentaReadDTO?> GetByIdAsync(int id);
        Task<IEnumerable<NotaPedidoVentaReadDTO>> ListAsync(bool includeInactive);
        Task UpdateAsync(int id, NotaPedidoVentaUpdateDTO dto);
        Task CancelAsync(int id);
    }
}
