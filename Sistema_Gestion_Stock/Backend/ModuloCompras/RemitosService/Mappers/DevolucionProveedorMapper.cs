using RemitosService.Domain.Entities;
using RemitosService.Application.DTOs;

namespace RemitosService.Mappers;

using RemitosService.Domain.Entities;
using RemitosService.Application.DTOs;

public static class DevolucionProveedorMapper
{
    public static DevolucionProveedorDTO ToDto(this DevolucionProveedor e) => new()
    {
        Id = e.Id,
        ProveedorId = e.ProveedorId,
        Fecha = e.Fecha,
        Motivo = e.Motivo,
        Activo = e.Activo
    };

    public static DevolucionProveedor ToEntity(this DevolucionProveedorCreateDTO dto) => new()
    {
        ProveedorId = dto.ProveedorId,
        Fecha = dto.Fecha,
        Motivo = dto.Motivo,
        Activo = true
    };

    public static DevolucionProveedor ToEntity(this DevolucionProveedorUpdateDTO dto) => new()
    {
        ProveedorId = dto.ProveedorId,
        Fecha = dto.Fecha,
        Motivo = dto.Motivo,
        Activo = dto.Activo
    };
}