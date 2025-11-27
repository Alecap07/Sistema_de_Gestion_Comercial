using ProveedoresService.Domain.Entities;
using ProveedoresService.Application.DTOs;

namespace ProveedoresService.Mappers;

public static class ProveedorTelefonoMapper
{
    public static ProveedorTelefonoDTO ToDto(this ProveedorTelefono e) => new()
    {
        Id = e.Id,
        ProveedorId = e.ProveedorId,
        Telefono = e.Telefono,
        Observacion = e.Observacion,
        Activo = e.Activo
    };

    public static ProveedorTelefono ToEntity(this ProveedorTelefonoDTO dto) => new()
    {
        Id = dto.Id,
        ProveedorId = dto.ProveedorId,
        Telefono = dto.Telefono,
        Observacion = dto.Observacion,
        Activo = dto.Activo
    };

    public static ProveedorTelefono ToEntity(this ProveedorTelefonoCreateDTO dto) => new()
    {
        Telefono = dto.Telefono,
        Observacion = dto.Observacion,
        Activo = true
    };

    public static ProveedorTelefono ToEntity(this ProveedorTelefonoUpdateDTO dto) => new()
    {
        Telefono = dto.Telefono,
        Observacion = dto.Observacion,
        Activo = dto.Activo
    };
}