using RemitosService.Domain.Entities;
using RemitosService.Application.DTOs;

namespace RemitosService.Mappers;

public static class RemitoItemMapper
{
    public static RemitoItemDTO ToDto(this RemitoItem e) => new()
    {
        Id = e.Id,
        RemitoId = e.RemitoId,
        ProductoId = e.ProductoId,
        Cantidad = e.Cantidad,
        Activo = e.Activo
    };

    public static RemitoItem ToEntity(this RemitoItemCreateDTO dto) => new()
    {
        RemitoId = dto.RemitoId,
        ProductoId = dto.ProductoId,
        Cantidad = dto.Cantidad,
        Activo = true
    };

    public static RemitoItem ToEntity(this RemitoItemUpdateDTO dto) => new()
    {
        RemitoId = dto.RemitoId,
        ProductoId = dto.ProductoId,
        Cantidad = dto.Cantidad,
        Activo = dto.Activo
    };
}