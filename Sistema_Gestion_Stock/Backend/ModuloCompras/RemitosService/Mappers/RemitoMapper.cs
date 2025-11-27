using RemitosService.Domain.Entities;
using RemitosService.Application.DTOs;

namespace RemitosService.Mappers;

public static class RemitoMapper
{
    public static RemitoDTO ToDto(this Remito e) => new()
    {
        Id = e.Id,
        OrdenCompraId = e.OrdenCompraId,
        ProveedorId = e.ProveedorId,
        Fecha = e.Fecha,
        Observacion = e.Observacion,
        Activo = e.Activo
    };

    public static Remito ToEntity(this RemitoCreateDTO dto) => new()
    {
        OrdenCompraId = dto.OrdenCompraId,
        ProveedorId = dto.ProveedorId,
        Fecha = dto.Fecha,
        Observacion = dto.Observacion,
        Activo = true
    };

    public static Remito ToEntity(this RemitoUpdateDTO dto) => new()
    {
        OrdenCompraId = dto.OrdenCompraId,
        ProveedorId = dto.ProveedorId,
        Fecha = dto.Fecha,
        Observacion = dto.Observacion,
        Activo = dto.Activo
    };
}