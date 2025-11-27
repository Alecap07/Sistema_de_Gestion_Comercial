using NotasPedidoService.Domain.Entities;
namespace NotasPedidoService.Domain.IRepositories

{
    public interface INotasPedidoVentaRepository
    {
        Task<int> CreateAsync(NotaPedidoVenta entity);
        Task<NotaPedidoVenta?> GetByIdAsync(int id);
        Task<IEnumerable<NotaPedidoVenta>> ListAsync(bool includeInactive);
        Task UpdateAsync(int id, NotaPedidoVenta entity);
        Task CancelAsync(int id);
    }
}
