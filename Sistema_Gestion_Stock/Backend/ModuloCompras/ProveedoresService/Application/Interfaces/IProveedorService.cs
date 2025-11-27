using ProveedoresService.Application.DTOs;
using ProveedoresService.Common.Enums;

namespace ProveedoresService.Application.Interfaces;

public interface IProveedorService
{
    Task<ProveedorDTO?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<ProveedorDTO?> GetByCodigoAsync(string codigo, CancellationToken ct = default);
    Task<IEnumerable<ProveedorDTO>> SearchAsync(
        string? razonSocial,
        string? codigo,
        int? personaId,
        EstadoFiltro estado = EstadoFiltro.Activos,
        CancellationToken ct = default);
    Task<int> CreateAsync(ProveedorCreateDTO dto, CancellationToken ct = default);
    Task UpdateAsync(int id, ProveedorUpdateDTO dto, CancellationToken ct = default);
}