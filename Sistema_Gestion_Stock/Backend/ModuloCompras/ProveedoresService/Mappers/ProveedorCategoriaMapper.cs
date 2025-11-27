using ProveedoresService.Domain.Entities;
using ProveedoresService.Application.DTOs;

namespace ProveedoresService.Mappers;

public static class ProveedorCategoriaMapper
{
    public static ProveedorCategoriaDTO ToDto(this ProveedorCategoria e) => new()
    {
        Id = e.Id,
        ProveedorId = e.ProveedorId,
        CategoriaId = e.CategoriaId,
        Activo = e.Activo
    };

    public static ProveedorCategoria ToEntity(this ProveedorCategoriaDTO dto) => new()
    {
        Id = dto.Id,
        ProveedorId = dto.ProveedorId,
        CategoriaId = dto.CategoriaId,
        Activo = dto.Activo
    };

    public static ProveedorCategoria ToEntity(this ProveedorCategoriaCreateDTO dto) => new()
    {
        CategoriaId = dto.CategoriaId,
        Activo = true
    };

    public static ProveedorCategoria ToEntity(this ProveedorCategoriaUpdateDTO dto) => new()
    {
        CategoriaId = dto.CategoriaId,
        Activo = dto.Activo
    };
}