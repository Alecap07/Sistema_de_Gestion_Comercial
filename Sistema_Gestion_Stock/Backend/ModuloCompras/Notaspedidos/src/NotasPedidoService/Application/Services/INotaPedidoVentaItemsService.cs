using NotasPedidoService.Application.DTOs;
using NotasPedidoService.Domain.Entities;
namespace NotasPedidoService.Application.Services

{
    public interface INotaPedidoVentaItemsService
    {
        Task<int> CreateAsync(NotaPedidoVentaItemCreateDTO dto);
        Task<NotaPedidoVentaItemReadDTO?> GetByIdAsync(int id);
        Task<IEnumerable<NotaPedidoVentaItemReadDTO>> ListByNotaAsync(int notaPedidoVentaId, bool includeInactive);
        Task UpdateAsync(int id, NotaPedidoVentaItemUpdateDTO dto);
        Task CancelAsync(int id);
    }
}
