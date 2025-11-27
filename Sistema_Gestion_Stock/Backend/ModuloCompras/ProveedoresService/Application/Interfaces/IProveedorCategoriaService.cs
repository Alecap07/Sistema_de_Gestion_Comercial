using ProveedoresService.Application.DTOs;
using ProveedoresService.Common.Enums;

namespace ProveedoresService.Application.Interfaces;

public interface IProveedorCategoriaService
{
    Task<IEnumerable<ProveedorCategoriaDTO>> GetByProveedorAsync(int proveedorId, EstadoFiltro estado, CancellationToken ct = default);
    Task<ProveedorCategoriaDTO?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<int> CreateAsync(int proveedorId, ProveedorCategoriaCreateDTO dto, CancellationToken ct = default);
    Task UpdateAsync(int id, ProveedorCategoriaUpdateDTO dto, CancellationToken ct = default);
}