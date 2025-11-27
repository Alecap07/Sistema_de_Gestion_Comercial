using ProductosService.Common.Enums;
using ProductosService.Domain.Entities;

namespace ProductosService.Domain.Interfaces;

public interface IProductoRepository
{
    Task<Producto?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<Producto?> GetByCodigoAsync(string codigo, CancellationToken ct = default);
    Task<IEnumerable<Producto>> SearchAsync(string? nombre, int? categoriaId, int? marcaId, EstadoFiltro estado = EstadoFiltro.Activos, CancellationToken ct = default);
    Task<int> CreateAsync(Producto entity, CancellationToken ct = default);
    Task UpdateAsync(Producto entity, CancellationToken ct = default);
    Task<int> AdjustStockDeltaAsync(int productoId, int delta, CancellationToken ct = default);
}