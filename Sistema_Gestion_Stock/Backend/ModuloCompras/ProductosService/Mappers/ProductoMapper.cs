using ProductosService.Application.DTOs;
using ProductosService.Domain.Entities;

namespace ProductosService.Mappers;

public static class ProductoMapper
{
    public static ProductoDTO ToDto(this Producto e) => new()
    {
        Id = e.Id,
        Codigo = e.Codigo,
        Nombre = e.Nombre,
        CategoriaId = e.CategoriaId,
        MarcaId = e.MarcaId,
        Descripcion = e.Descripcion,
        Lote = e.Lote,
        FechaVencimiento = e.FechaVencimiento,
        UnidadesAviso = e.UnidadesAviso,
        PrecioCompra = e.PrecioCompra,
        PrecioVenta = e.PrecioVenta,
        StockActual = e.StockActual,
        StockMinimo = e.StockMinimo,
        StockIdeal = e.StockIdeal,
        StockMaximo = e.StockMaximo,
        TipoStock = e.TipoStock,
        Activo = e.Activo
    };

    public static Producto ToEntity(this ProductoCreateDTO dto, int id = 0) => new()
    {
        Id = id,
        Codigo = dto.Codigo,
        Nombre = dto.Nombre,
        CategoriaId = dto.CategoriaId,
        MarcaId = dto.MarcaId,
        Descripcion = dto.Descripcion,
        Lote = dto.Lote,
        FechaVencimiento = dto.FechaVencimiento,
        UnidadesAviso = dto.UnidadesAviso,
        PrecioCompra = dto.PrecioCompra,
        PrecioVenta = dto.PrecioVenta,
        StockActual = dto.StockActual,
        StockMinimo = dto.StockMinimo,
        StockIdeal = dto.StockIdeal,
        StockMaximo = dto.StockMaximo,
        TipoStock = dto.TipoStock,
        Activo = true // siempre se crea habilitado
    };

    public static Producto ToEntity(this ProductoUpdateDTO dto, int id)
    {
        var e = dto.ToEntity();
        e.Id = id;
        e.Activo = dto.Activo;
        return e;
    }
}