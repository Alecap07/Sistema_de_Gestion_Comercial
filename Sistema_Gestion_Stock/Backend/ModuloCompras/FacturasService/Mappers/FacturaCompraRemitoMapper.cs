// placeholder
using FacturasService.Domain.Entities;
using FacturasService.Application.DTOs;

namespace FacturasService.Mappers;

public static class FacturaCompraRemitoMapper
{
    public static FacturaCompraRemitoDTO ToDto(this FacturaCompraRemito e) => new()
    {
        Id = e.Id,
        FacturaId = e.FacturaId,
        RemitoId = e.RemitoId,
        Activo = e.Activo
    };

    public static FacturaCompraRemito ToEntity(this FacturaCompraRemitoCreateDTO dto) => new()
    {
        FacturaId = dto.FacturaId,
        RemitoId = dto.RemitoId,
        Activo = true
    };

    public static FacturaCompraRemito ToEntity(this FacturaCompraRemitoUpdateDTO dto) => new()
    {
        FacturaId = dto.FacturaId,
        RemitoId = dto.RemitoId,
        Activo = dto.Activo
    };
}