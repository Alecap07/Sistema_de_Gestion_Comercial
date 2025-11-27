using ProveedoresService.Domain.Entities;
using ProveedoresService.Application.DTOs;

namespace ProveedoresService.Mappers;

public static class ProveedorMapper
{
    public static ProveedorDTO ToDto(this Proveedor e) => new()
    {
        Id = e.Id,
        PersonaId = e.PersonaId,
        Codigo = e.Codigo,
        RazonSocial = e.RazonSocial,
        FormaPago = e.FormaPago,
        TiempoEntregaDias = e.TiempoEntregaDias,
        DescuentosOtorgados = e.DescuentosOtorgados,
        Activo = e.Activo
    };

    public static Proveedor ToEntity(this ProveedorCreateDTO dto) => new()
    {
        PersonaId = dto.PersonaId,
        Codigo = dto.Codigo,
        RazonSocial = dto.RazonSocial,
        FormaPago = dto.FormaPago,
        TiempoEntregaDias = dto.TiempoEntregaDias,
        DescuentosOtorgados = dto.DescuentosOtorgados,
        Activo = true // Alta siempre habilitado
    };

    public static Proveedor ToEntity(this ProveedorUpdateDTO dto, int id) => new()
    {
        Id = id,
        PersonaId = dto.PersonaId,
        Codigo = dto.Codigo,
        RazonSocial = dto.RazonSocial,
        FormaPago = dto.FormaPago,
        TiempoEntregaDias = dto.TiempoEntregaDias,
        DescuentosOtorgados = dto.DescuentosOtorgados,
        Activo = dto.Activo
    };
}