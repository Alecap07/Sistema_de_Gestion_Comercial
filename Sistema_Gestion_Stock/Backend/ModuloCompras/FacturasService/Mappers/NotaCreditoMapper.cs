// placeholder
using FacturasService.Domain.Entities;
using FacturasService.Application.DTOs;

namespace FacturasService.Mappers;

public static class NotaCreditoMapper
{
    public static NotaCreditoDTO ToDto(this NotaCredito e) => new()
    {
        Id = e.Id,
        ProveedorId = e.ProveedorId,
        Fecha = e.Fecha,
        Motivo = e.Motivo,
        Monto = e.Monto,
        FacturaId = e.FacturaId,
        Activo = e.Activo
    };

    public static NotaCredito ToEntity(this NotaCreditoCreateDTO dto) => new()
    {
        ProveedorId = dto.ProveedorId,
        Fecha = dto.Fecha,
        Motivo = dto.Motivo,
        Monto = dto.Monto,
        FacturaId = dto.FacturaId,
        Activo = true
    };

    public static NotaCredito ToEntity(this NotaCreditoUpdateDTO dto) => new()
    {
        ProveedorId = dto.ProveedorId,
        Fecha = dto.Fecha,
        Motivo = dto.Motivo,
        Monto = dto.Monto,
        FacturaId = dto.FacturaId,
        Activo = dto.Activo
    };
}