using ProductosService.Application.DTOs;
using ProductosService.Common.Enums;

namespace ProductosService.Application.Interfaces;

public interface IProductoService
{
    Task<ProductoDTO?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<ProductoDTO?> GetByCodigoAsync(string codigo, CancellationToken ct = default);
    Task<IEnumerable<ProductoDTO>> SearchAsync(string? nombre, int? categoriaId, int? marcaId, EstadoFiltro estado = EstadoFiltro.Activos, CancellationToken ct = default);
    Task<int> CreateAsync(ProductoCreateDTO dto, CancellationToken ct = default);
    Task UpdateAsync(int id, ProductoUpdateDTO dto, CancellationToken ct = default);
    Task<int> AdjustStockDeltaAsync(int productoId, int delta, CancellationToken ct = default);
}