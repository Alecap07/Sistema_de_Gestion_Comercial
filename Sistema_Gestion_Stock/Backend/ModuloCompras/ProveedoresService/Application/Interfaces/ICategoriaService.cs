using ProveedoresService.Application.DTOs;
using ProveedoresService.Common.Enums;

namespace ProveedoresService.Application.Interfaces;

public interface ICategoriaService
{
    Task<CategoriaDTO?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<CategoriaDTO>> SearchAsync(string? nombre, EstadoFiltro estado = EstadoFiltro.Activos, CancellationToken ct = default);
    Task<int> CreateAsync(CategoriaCreateDTO dto, CancellationToken ct = default);
    Task UpdateAsync(int id, CategoriaUpdateDTO dto, CancellationToken ct = default);
}