using ProveedoresService.Domain.Entities;
using ProveedoresService.Application.DTOs;

namespace ProveedoresService.Mappers;

public static class ProveedorProductoMapper
{
    public static ProveedorProductoDTO ToDto(this ProveedorProducto e) => new()
    {
        Id = e.Id,
        ProveedorId = e.ProveedorId,
        ProductoId = e.ProductoId,
        PrecioCompra = e.PrecioCompra,
        CatalogoUrl = e.CatalogoUrl,
        FechaDesde = e.FechaDesde,
        Activo = e.Activo
    };

    public static ProveedorProducto ToEntity(this ProveedorProductoDTO dto) => new()
    {
        Id = dto.Id,
        ProveedorId = dto.ProveedorId,
        ProductoId = dto.ProductoId,
        PrecioCompra = dto.PrecioCompra,
        CatalogoUrl = dto.CatalogoUrl,
        FechaDesde = dto.FechaDesde,
        Activo = dto.Activo
    };

    public static ProveedorProducto ToEntity(this ProveedorProductoCreateDTO dto) => new()
    {
        ProductoId = dto.ProductoId,
        PrecioCompra = dto.PrecioCompra,
        CatalogoUrl = dto.CatalogoUrl,
        FechaDesde = dto.FechaDesde,
        Activo = true
    };

    public static ProveedorProducto ToEntity(this ProveedorProductoUpdateDTO dto) => new()
    {
        ProductoId = dto.ProductoId,
        PrecioCompra = dto.PrecioCompra,
        CatalogoUrl = dto.CatalogoUrl,
        FechaDesde = dto.FechaDesde,
        Activo = dto.Activo
    };
}