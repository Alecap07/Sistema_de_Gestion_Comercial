using PresupuestosService.Application.DTOs;
using PresupuestosService.Domain.Entities;

namespace PresupuestosService.Application.Mapping;

public static class PresupuestoVentaItemMapping
{
    public static PresupuestoVentaItem ToEntity(this PresupuestoVentaItemCreateDto dto) => new()
    {
        PresupuestoVentaId = dto.PresupuestoVentaId,
        ProductoId = dto.ProductoId,
        Cantidad = dto.Cantidad,
        PrecioUnitario = dto.PrecioUnitario,
        Activo = dto.Activo
    };

    public static PresupuestoVentaItemReadDto ToReadDto(this PresupuestoVentaItem e) => new()
    {
        Id = e.Id,
        PresupuestoVentaId = e.PresupuestoVentaId,
        ProductoId = e.ProductoId,
        Cantidad = e.Cantidad,
        PrecioUnitario = e.PrecioUnitario,
        Activo = e.Activo
    };

    public static void ApplyUpdate(this PresupuestoVentaItem e, PresupuestoVentaItemUpdateDto dto)
    {
        if (dto.PresupuestoVentaId.HasValue) e.PresupuestoVentaId = dto.PresupuestoVentaId.Value;
        if (dto.ProductoId.HasValue) e.ProductoId = dto.ProductoId.Value;
        if (dto.Cantidad.HasValue) e.Cantidad = dto.Cantidad.Value;
        if (dto.PrecioUnitario.HasValue) e.PrecioUnitario = dto.PrecioUnitario.Value;
        if (dto.Activo.HasValue) e.Activo = dto.Activo.Value;
    }
}