// placeholder
using FacturasService.Domain.Entities;
using FacturasService.Application.DTOs;

namespace FacturasService.Mappers;

public static class FacturaCompraItemMapper
{
    public static FacturaCompraItemDTO ToDto(this FacturaCompraItem e) => new()
    {
        Id = e.Id,
        FacturaId = e.FacturaId,
        ProductoId = e.ProductoId,
        Cantidad = e.Cantidad,
        PrecioUnitario = e.PrecioUnitario,
        Activo = e.Activo
    };

    public static FacturaCompraItem ToEntity(this FacturaCompraItemCreateDTO dto) => new()
    {
        FacturaId = dto.FacturaId,
        ProductoId = dto.ProductoId,
        Cantidad = dto.Cantidad,
        PrecioUnitario = dto.PrecioUnitario,
        Activo = true
    };

    public static FacturaCompraItem ToEntity(this FacturaCompraItemUpdateDTO dto) => new()
    {
        FacturaId = dto.FacturaId,
        ProductoId = dto.ProductoId,
        Cantidad = dto.Cantidad,
        PrecioUnitario = dto.PrecioUnitario,
        Activo = dto.Activo
    };
}