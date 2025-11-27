// placeholder
using FacturasService.Domain.Entities;
using FacturasService.Application.DTOs;

namespace FacturasService.Mappers;

public static class NotaDebitoMapper
{
    public static NotaDebitoDTO ToDto(this NotaDebito e) => new()
    {
        Id = e.Id,
        ProveedorId = e.ProveedorId,
        Fecha = e.Fecha,
        Motivo = e.Motivo,
        Monto = e.Monto,
        FacturaId = e.FacturaId,
        Activo = e.Activo
    };

    public static NotaDebito ToEntity(this NotaDebitoCreateDTO dto) => new()
    {
        ProveedorId = dto.ProveedorId,
        Fecha = dto.Fecha,
        Motivo = dto.Motivo,
        Monto = dto.Monto,
        FacturaId = dto.FacturaId,
        Activo = true
    };

    public static NotaDebito ToEntity(this NotaDebitoUpdateDTO dto) => new()
    {
        ProveedorId = dto.ProveedorId,
        Fecha = dto.Fecha,
        Motivo = dto.Motivo,
        Monto = dto.Monto,
        FacturaId = dto.FacturaId,
        Activo = dto.Activo
    };
}