using ProveedoresService.Domain.Entities;
using ProveedoresService.Application.DTOs;

namespace ProveedoresService.Mappers;

public static class CategoriaMapper
{
    public static CategoriaDTO ToDto(this Categoria e) => new()
    {
        Id = e.Id,
        Nombre = e.Nombre,
        Descripcion = e.Descripcion,
        Activo = e.Activo
    };

    public static Categoria ToEntity(this CategoriaDTO dto) => new()
    {
        Id = dto.Id,
        Nombre = dto.Nombre,
        Descripcion = dto.Descripcion,
        Activo = dto.Activo
    };

    public static Categoria ToEntity(this CategoriaCreateDTO dto) => new()
    {
        Nombre = dto.Nombre,
        Descripcion = dto.Descripcion,
        Activo = true
    };

    public static Categoria ToEntity(this CategoriaUpdateDTO dto) => new()
    {
        Nombre = dto.Nombre,
        Descripcion = dto.Descripcion,
        Activo = dto.Activo
    };
}