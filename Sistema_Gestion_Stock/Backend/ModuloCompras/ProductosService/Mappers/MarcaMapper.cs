using ProductosService.Application.DTOs;
using ProductosService.Domain.Entities;

namespace ProductosService.Mappers;

public static class MarcaMapper
{
    public static MarcaDTO ToDto(this Marca e) => new()
    {
        Id = e.Id,
        Nombre = e.Nombre,
        Activo = e.Activo
    };

    public static Marca ToEntity(this MarcaCreateDTO dto, int id = 0) => new()
    {
        Id = id,
        Nombre = dto.Nombre,
        Activo = true
    };

    public static Marca ToEntity(this MarcaUpdateDTO dto, int id) => new()
    {
        Id = id,
        Nombre = dto.Nombre,
        Activo = dto.Activo
    };
}