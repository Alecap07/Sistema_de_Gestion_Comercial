using PresupuestosService.Application.DTOs;
using PresupuestosService.Domain.Entities;

namespace PresupuestosService.Application.Mapping;

public static class PresupuestoVentaMapping
{
    public static PresupuestoVenta ToEntity(this PresupuestoVentaCreateDto dto) => new()
    {
        ClienteId = dto.ClienteId,
        Fecha = dto.Fecha,
        Estado = dto.Estado,
        Observacion = dto.Observacion,
        Activo = dto.Activo
    };

    public static PresupuestoVentaReadDto ToReadDto(this PresupuestoVenta e) => new()
    {
        Id = e.Id,
        ClienteId = e.ClienteId,
        Fecha = e.Fecha,
        Estado = e.Estado,
        Observacion = e.Observacion,
        Activo = e.Activo,
        Items = e.Items.Select(i => i.ToReadDto()).ToList()
    };

    public static void ApplyUpdate(this PresupuestoVenta e, PresupuestoVentaUpdateDto dto)
    {
        if (dto.ClienteId.HasValue) e.ClienteId = dto.ClienteId.Value;
        if (dto.Fecha.HasValue) e.Fecha = dto.Fecha.Value;
        if (!string.IsNullOrWhiteSpace(dto.Estado)) e.Estado = dto.Estado!;
        if (dto.Observacion is not null) e.Observacion = dto.Observacion;
        if (dto.Activo.HasValue) e.Activo = dto.Activo.Value;
    }
}