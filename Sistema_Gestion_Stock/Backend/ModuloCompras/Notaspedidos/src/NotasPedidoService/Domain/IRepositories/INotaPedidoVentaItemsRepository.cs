using NotasPedidoService.Domain.Entities;
namespace NotasPedidoService.Domain.IRepositories
{
    public interface INotaPedidoVentaItemsRepository
    {
        Task<int> CreateAsync(NotaPedidoVentaItem entity);
        Task<NotaPedidoVentaItem?> GetByIdAsync(int id);
        Task<IEnumerable<NotaPedidoVentaItem>> ListByNotaAsync(int notaPedidoVentaId, bool includeInactive);
        Task UpdateAsync(int id, NotaPedidoVentaItem entity);
        Task CancelAsync(int id);
    }
}
