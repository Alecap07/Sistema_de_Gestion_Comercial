using ProductosService.Application.DTOs;
using ProductosService.Common.Enums;

namespace ProductosService.Application.Interfaces;

public interface ICategoriaService
{
    Task<CategoriaDTO?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<CategoriaDTO>> GetAllAsync(EstadoFiltro estado = EstadoFiltro.Activos, CancellationToken ct = default);
    Task<int> CreateAsync(CategoriaCreateDTO dto, CancellationToken ct = default);
    Task UpdateAsync(int id, CategoriaUpdateDTO dto, CancellationToken ct = default);
}