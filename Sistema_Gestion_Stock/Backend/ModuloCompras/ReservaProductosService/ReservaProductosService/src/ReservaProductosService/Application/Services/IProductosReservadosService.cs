using ReservaProductosService.Application.DTOs;
using ReservaProductosService.Common;

namespace ReservaProductosService.Application.Services;

public interface IProductosReservadosService
{
    Task<Result<int>> CreateAsync(ProductoReservadoCreateDto dto);
    Task<Result<IReadOnlyList<ProductoReservadoReadDto>>> ListAsync(string? estado);              // Lista filtrada (activos/inactivos/todos)
    Task<Result<ProductoReservadoReadDto>> GetByIdAsync(int id);                    // Incluye inactivo
    Task<Result<bool>> UpdateAsync(int id, ProductoReservadoUpdateDto dto);
    Task<Result<bool>> CancelAsync(int id);                                         // Soft delete (Activo=0)
    // Task<Result<PaginatedResult<ProductoReservadoReadDto>>> ListPagedAsync(int page, int pageSize); // (opcional futuro)
}