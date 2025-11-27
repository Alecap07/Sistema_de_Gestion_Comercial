using ProductosService.Application.DTOs;
using ProductosService.Application.Interfaces;
using ProductosService.Common.Enums;
using ProductosService.Domain.Interfaces;
using ProductosService.Mappers;

namespace ProductosService.Application.Services;

public sealed class ProductoService : IProductoService
{
    private readonly IProductoRepository _repo;

    public ProductoService(IProductoRepository repo) => _repo = repo;

    public async Task<ProductoDTO?> GetByIdAsync(int id, CancellationToken ct = default)
        => (await _repo.GetByIdAsync(id, ct))?.ToDto();

    public async Task<ProductoDTO?> GetByCodigoAsync(string codigo, CancellationToken ct = default)
        => (await _repo.GetByCodigoAsync(codigo, ct))?.ToDto();

    public async Task<IEnumerable<ProductoDTO>> SearchAsync(string? nombre, int? categoriaId, int? marcaId, EstadoFiltro estado = EstadoFiltro.Activos, CancellationToken ct = default)
        => (await _repo.SearchAsync(nombre, categoriaId, marcaId, estado, ct)).Select(p => p.ToDto());

    public Task<int> CreateAsync(ProductoCreateDTO dto, CancellationToken ct = default)
        => _repo.CreateAsync(dto.ToEntity(), ct);

    public Task UpdateAsync(int id, ProductoUpdateDTO dto, CancellationToken ct = default)
        => _repo.UpdateAsync(dto.ToEntity(id), ct);

    public Task<int> AdjustStockDeltaAsync(int productoId, int delta, CancellationToken ct = default)
        => _repo.AdjustStockDeltaAsync(productoId, delta, ct);
}