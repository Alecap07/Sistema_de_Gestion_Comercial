using ProveedoresService.Application.DTOs;
using ProveedoresService.Common.Enums;

namespace ProveedoresService.Application.Interfaces;

public interface IProveedorTelefonoService
{
    Task<IEnumerable<ProveedorTelefonoDTO>> GetByProveedorAsync(int proveedorId, EstadoFiltro estado, CancellationToken ct = default);
    Task<ProveedorTelefonoDTO?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<int> CreateAsync(int proveedorId, ProveedorTelefonoCreateDTO dto, CancellationToken ct = default);
    Task UpdateAsync(int id, ProveedorTelefonoUpdateDTO dto, CancellationToken ct = default);
}