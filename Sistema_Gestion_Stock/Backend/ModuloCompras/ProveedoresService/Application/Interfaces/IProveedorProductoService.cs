using ProveedoresService.Application.DTOs;
using ProveedoresService.Common.Enums;

namespace ProveedoresService.Application.Interfaces;

public interface IProveedorProductoService
{
    Task<IEnumerable<ProveedorProductoDTO>> GetByProveedorAsync(int proveedorId, EstadoFiltro estado, CancellationToken ct = default);
    Task<ProveedorProductoDTO?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<int> CreateAsync(int proveedorId, ProveedorProductoCreateDTO dto, CancellationToken ct = default);
    Task UpdateAsync(int id, ProveedorProductoUpdateDTO dto, CancellationToken ct = default);
}