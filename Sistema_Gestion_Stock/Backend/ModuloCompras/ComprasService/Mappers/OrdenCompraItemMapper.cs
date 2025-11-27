using ComprasService.Domain.Entities;
using ComprasService.Application.DTOs;

namespace ComprasService.Mappers;

public static class OrdenCompraItemMapper
{
    public static OrdenCompraItemDTO ToDto(this OrdenCompraItem e) => new()
    {
        Id = e.Id,
        OrdenCompraId = e.OrdenCompraId,
        ProductoId = e.ProductoId,
        Cantidad = e.Cantidad,
        PrecioUnitario = e.PrecioUnitario,
        Activo = e.Activo
    };

    public static OrdenCompraItem ToEntity(this OrdenCompraItemCreateDTO dto) => new()
    {
        OrdenCompraId = dto.OrdenCompraId,
        ProductoId = dto.ProductoId,
        Cantidad = dto.Cantidad,
        PrecioUnitario = dto.PrecioUnitario,
        Activo = true
    };

    public static OrdenCompraItem ToEntity(this OrdenCompraItemUpdateDTO dto) => new()
    {
        OrdenCompraId = dto.OrdenCompraId,
        ProductoId = dto.ProductoId,
        Cantidad = dto.Cantidad,
        PrecioUnitario = dto.PrecioUnitario,
        Activo = dto.Activo
    };
}