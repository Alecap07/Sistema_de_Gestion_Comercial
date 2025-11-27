using RemitosService.Domain.Entities;
using RemitosService.Application.DTOs;

namespace RemitosService.Mappers;

public static class DevolucionItemMapper
{
    public static DevolucionItemDTO ToDto(this DevolucionItem e) => new()
    {
        Id = e.Id,
        DevolucionId = e.DevolucionId,
        ProductoId = e.ProductoId,
        Cantidad = e.Cantidad,
        Activo = e.Activo
    };

    public static DevolucionItem ToEntity(this DevolucionItemCreateDTO dto) => new()
    {
        DevolucionId = dto.DevolucionId,
        ProductoId = dto.ProductoId,
        Cantidad = dto.Cantidad,
        Activo = true
    };

    public static DevolucionItem ToEntity(this DevolucionItemUpdateDTO dto) => new()
    {
        DevolucionId = dto.DevolucionId,
        ProductoId = dto.ProductoId,
        Cantidad = dto.Cantidad,
        Activo = dto.Activo
    };
}