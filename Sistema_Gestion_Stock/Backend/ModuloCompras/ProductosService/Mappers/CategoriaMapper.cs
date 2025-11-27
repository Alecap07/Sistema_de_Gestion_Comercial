using ProductosService.Application.DTOs;
using ProductosService.Domain.Entities;

namespace ProductosService.Mappers;

public static class CategoriaMapper
{
    public static CategoriaDTO ToDto(this Categoria e) => new()
    {
        Id = e.Id,
        Nombre = e.Nombre,
        Activo = e.Activo
    };

    public static Categoria ToEntity(this CategoriaCreateDTO dto, int id = 0) => new()
    {
        Id = id,
        Nombre = dto.Nombre,
        Activo = true
    };

    public static Categoria ToEntity(this CategoriaUpdateDTO dto, int id) => new()
    {
        Id = id,
        Nombre = dto.Nombre,
        Activo = dto.Activo
    };
}