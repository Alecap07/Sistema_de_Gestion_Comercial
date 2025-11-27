using ComprasService.Domain.Entities;
using ComprasService.Application.DTOs;

namespace ComprasService.Mappers;

public static class PresupuestoMapper
{
    public static PresupuestoDTO ToDto(this Presupuesto e) => new()
    {
        Id = e.Id,
        ProveedorId = e.ProveedorId,
        Fecha = e.Fecha,
        Estado = e.Estado,
        Observacion = e.Observacion,
        Activo = e.Activo
    };

    public static Presupuesto ToEntity(this PresupuestoCreateDTO dto) => new()
    {
        ProveedorId = dto.ProveedorId,
        Fecha = dto.Fecha,
        Estado = dto.Estado,
        Observacion = dto.Observacion,
        Activo = true
    };

    public static Presupuesto ToEntity(this PresupuestoUpdateDTO dto) => new()
    {
        ProveedorId = dto.ProveedorId,
        Fecha = dto.Fecha,
        Estado = dto.Estado,
        Observacion = dto.Observacion,
        Activo = dto.Activo
    };
}