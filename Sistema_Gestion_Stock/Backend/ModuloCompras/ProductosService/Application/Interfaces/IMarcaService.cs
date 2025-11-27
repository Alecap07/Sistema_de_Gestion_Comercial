using ProductosService.Application.DTOs;
using ProductosService.Common.Enums;

namespace ProductosService.Application.Interfaces;

public interface IMarcaService
{
    Task<MarcaDTO?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<MarcaDTO>> GetAllAsync(EstadoFiltro estado = EstadoFiltro.Activos, CancellationToken ct = default);
    Task<int> CreateAsync(MarcaCreateDTO dto, CancellationToken ct = default);
    Task UpdateAsync(int id, MarcaUpdateDTO dto, CancellationToken ct = default);
}