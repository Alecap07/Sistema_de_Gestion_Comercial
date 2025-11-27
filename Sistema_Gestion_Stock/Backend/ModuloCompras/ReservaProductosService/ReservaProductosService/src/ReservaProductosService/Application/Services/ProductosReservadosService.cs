using ReservaProductosService.Application.DTOs;
using ReservaProductosService.Application.Mapping;
using ReservaProductosService.Common;
using ReservaProductosService.Domain.Repositories;

namespace ReservaProductosService.Application.Services;

public class ProductosReservadosService : IProductosReservadosService
{
    private readonly IProductosReservadosRepository _repo;

    public ProductosReservadosService(IProductosReservadosRepository repo)
    {
        _repo = repo;
    }

    public async Task<Result<int>> CreateAsync(ProductoReservadoCreateDto dto)
    {
        var entity = dto.ToEntity();
        var id = await _repo.CreateAsync(entity);
        return Result<int>.Ok(id);
    }

    public async Task<Result<IReadOnlyList<ProductoReservadoReadDto>>> ListAsync(string? estado)
    {
        bool soloActivos = false;
        bool soloInactivos = false;

        switch (estado?.ToLowerInvariant())
        {
            case null:
            case "":
            case "activos":
                soloActivos = true; // por defecto sólo activos
                break;
            case "inactivos":
                soloInactivos = true;
                break;
            case "todos":
                // ambos en false -> el SP devuelve todos
                break;
            default:
                return Result<IReadOnlyList<ProductoReservadoReadDto>>.Fail("Parámetro 'estado' inválido. Use 'activos', 'inactivos' o 'todos'.");
        }

        var list = await _repo.ListAsync(soloActivos, soloInactivos);
        var mapped = list.Select(e => e.ToReadDto()).ToList();
        return Result<IReadOnlyList<ProductoReservadoReadDto>>.Ok(mapped);
    }

    public async Task<Result<ProductoReservadoReadDto>> GetByIdAsync(int id)
    {
        var entity = await _repo.GetByIdAsync(id);
        return entity is null
            ? Result<ProductoReservadoReadDto>.Fail("Producto reservado no encontrado")
            : Result<ProductoReservadoReadDto>.Ok(entity.ToReadDto());
    }

    public async Task<Result<bool>> UpdateAsync(int id, ProductoReservadoUpdateDto dto)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity is null)
            return Result<bool>.Fail("Producto reservado no encontrado");

        entity.ApplyUpdate(dto);
        var ok = await _repo.UpdateAsync(entity);
        return ok ? Result<bool>.Ok(true) : Result<bool>.Fail("No se pudo actualizar");
    }

    public async Task<Result<bool>> CancelAsync(int id)
    {
        var ok = await _repo.CancelAsync(id);
        return ok ? Result<bool>.Ok(true) : Result<bool>.Fail("No se pudo cancelar");
    }

    // Ejemplo futuro de paginación (si agregas SP o SELECT con OFFSET/FETCH):
    /*
    public async Task<Result<PaginatedResult<ProductoReservadoReadDto>>> ListPagedAsync(int page, int pageSize)
    {
        var (items, total) = await _repo.ListPagedAsync(page, pageSize);
        var mapped = items.Select(x => x.ToReadDto()).ToList();
        var paginated = PaginatedResult<ProductoReservadoReadDto>.Create(mapped, page, pageSize, total);
        return Result<PaginatedResult<ProductoReservadoReadDto>>.Ok(paginated);
    }
    */
}