// placeholder
using FacturasService.Domain.Entities;
using FacturasService.Application.DTOs;

namespace FacturasService.Mappers;

public static class FacturaCompraMapper
{
    public static FacturaCompraDTO ToDto(this FacturaCompra e) => new()
    {
        Id = e.Id,
        ProveedorId = e.ProveedorId,
        NumeroFactura = e.NumeroFactura,
        Fecha = e.Fecha,
        Total = e.Total,
        Activo = e.Activo
    };

    public static FacturaCompra ToEntity(this FacturaCompraCreateDTO dto) => new()
    {
        ProveedorId = dto.ProveedorId,
        NumeroFactura = dto.NumeroFactura,
        Fecha = dto.Fecha,
        Total = dto.Total,
        Activo = true
    };

    public static FacturaCompra ToEntity(this FacturaCompraUpdateDTO dto) => new()
    {
        ProveedorId = dto.ProveedorId,
        NumeroFactura = dto.NumeroFactura,
        Fecha = dto.Fecha,
        Total = dto.Total,
        Activo = dto.Activo
    };
}