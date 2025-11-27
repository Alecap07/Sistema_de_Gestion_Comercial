using ReservaProductosService.Application.DTOs;
using ReservaProductosService.Domain.Entities;

namespace ReservaProductosService.Application.Mapping;

public static class ProductoReservadoMapping
{
    public static ProductoReservado ToEntity(this ProductoReservadoCreateDto dto) => new()
    {
        NotaPedidoVentaId = dto.NotaPedidoVentaId,
        ProductoId = dto.ProductoId,
        Cantidad = dto.Cantidad,
        FechaReserva = dto.FechaReserva.Date,
        Activo = dto.Activo
    };

    public static ProductoReservadoReadDto ToReadDto(this ProductoReservado e) => new()
    {
        Id = e.Id,
        NotaPedidoVentaId = e.NotaPedidoVentaId,
        ProductoId = e.ProductoId,
        Cantidad = e.Cantidad,
        FechaReserva = e.FechaReserva,
        Activo = e.Activo
    };

    public static void ApplyUpdate(this ProductoReservado e, ProductoReservadoUpdateDto dto)
    {
        if (dto.NotaPedidoVentaId.HasValue) e.NotaPedidoVentaId = dto.NotaPedidoVentaId.Value;
        if (dto.ProductoId.HasValue) e.ProductoId = dto.ProductoId.Value;
        if (dto.Cantidad.HasValue) e.Cantidad = dto.Cantidad.Value;
        if (dto.FechaReserva.HasValue) e.FechaReserva = dto.FechaReserva.Value.Date;
        if (dto.Activo.HasValue) e.Activo = dto.Activo.Value;
    }
}