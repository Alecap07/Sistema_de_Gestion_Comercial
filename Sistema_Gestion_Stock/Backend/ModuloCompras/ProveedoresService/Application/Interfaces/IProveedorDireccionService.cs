using ProveedoresService.Application.DTOs;
using ProveedoresService.Common.Enums;

namespace ProveedoresService.Application.Interfaces;

public interface IProveedorDireccionService
{
    Task<IEnumerable<ProveedorDireccionDTO>> GetByProveedorAsync(int proveedorId, EstadoFiltro estado, CancellationToken ct = default);
    Task<ProveedorDireccionDTO?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<int> CreateAsync(int proveedorId, ProveedorDireccionCreateDTO dto, CancellationToken ct = default);
    Task UpdateAsync(int id, ProveedorDireccionUpdateDTO dto, CancellationToken ct = default);
}