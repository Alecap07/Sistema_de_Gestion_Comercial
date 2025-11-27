using ComprasService.Domain.Entities;
using ComprasService.Application.DTOs;

namespace ComprasService.Mappers;

public static class OrdenCompraMapper
{
    public static OrdenCompraDTO ToDto(this OrdenCompra e) => new()
    {
        Id = e.Id,
        ProveedorId = e.ProveedorId,
        Fecha = e.Fecha,
        Estado = e.Estado,
        Observacion = e.Observacion,
        Activo = e.Activo
    };

    public static OrdenCompra ToEntity(this OrdenCompraCreateDTO dto) => new()
    {
        ProveedorId = dto.ProveedorId,
        Fecha = dto.Fecha,
        Estado = dto.Estado,
        Observacion = dto.Observacion,
        Activo = true
    };

    public static OrdenCompra ToEntity(this OrdenCompraUpdateDTO dto) => new()
    {
        ProveedorId = dto.ProveedorId,
        Fecha = dto.Fecha,
        Estado = dto.Estado,
        Observacion = dto.Observacion,
        Activo = dto.Activo
    };
}