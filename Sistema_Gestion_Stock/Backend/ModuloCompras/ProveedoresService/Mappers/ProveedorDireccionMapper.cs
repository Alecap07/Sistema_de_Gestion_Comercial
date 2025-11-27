using ProveedoresService.Domain.Entities;
using ProveedoresService.Application.DTOs;

namespace ProveedoresService.Mappers;

public static class ProveedorDireccionMapper
{
    public static ProveedorDireccionDTO ToDto(this ProveedorDireccion e) => new()
    {
        Id = e.Id,
        ProveedorId = e.ProveedorId,
        Calle = e.Calle,
        Altura = e.Altura,
        Localidad = e.Localidad,
        Observacion = e.Observacion,
        Activo = e.Activo
    };

    public static ProveedorDireccion ToEntity(this ProveedorDireccionDTO dto) => new()
    {
        Id = dto.Id,
        ProveedorId = dto.ProveedorId,
        Calle = dto.Calle,
        Altura = dto.Altura,
        Localidad = dto.Localidad,
        Observacion = dto.Observacion,
        Activo = dto.Activo
    };

    public static ProveedorDireccion ToEntity(this ProveedorDireccionCreateDTO dto) => new()
    {
        Calle = dto.Calle,
        Altura = dto.Altura,
        Localidad = dto.Localidad,
        Observacion = dto.Observacion,
        Activo = true
    };

    public static ProveedorDireccion ToEntity(this ProveedorDireccionUpdateDTO dto) => new()
    {
        Calle = dto.Calle,
        Altura = dto.Altura,
        Localidad = dto.Localidad,
        Observacion = dto.Observacion,
        Activo = dto.Activo
    };
}