using ComprasService.Domain.Entities;
using ComprasService.Application.DTOs;

namespace ComprasService.Mappers;

public static class PresupuestoItemMapper
{
    public static PresupuestoItemDTO ToDto(this PresupuestoItem e) => new()
    {
        Id = e.Id,
        PresupuestoId = e.PresupuestoId,
        ProductoId = e.ProductoId,
        Cantidad = e.Cantidad,
        PrecioUnitario = e.PrecioUnitario,
        Activo = e.Activo
    };

    public static PresupuestoItem ToEntity(this PresupuestoItemCreateDTO dto) => new()
    {
        PresupuestoId = dto.PresupuestoId,
        ProductoId = dto.ProductoId,
        Cantidad = dto.Cantidad,
        PrecioUnitario = dto.PrecioUnitario,
        Activo = true
    };

    public static PresupuestoItem ToEntity(this PresupuestoItemUpdateDTO dto) => new()
    {
        PresupuestoId = dto.PresupuestoId,
        ProductoId = dto.ProductoId,
        Cantidad = dto.Cantidad,
        PrecioUnitario = dto.PrecioUnitario,
        Activo = dto.Activo
    };
}