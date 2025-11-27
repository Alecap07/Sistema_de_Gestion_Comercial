using ClientesService.Application.DTOs;
using ClientesService.Domain.Entities;

namespace ClientesService.Application.Mapping;

public static class ClienteMapping
{
    // Entity -> Read DTO
    public static ClienteReadDto ToReadDto(this Cliente c) => new()
    {
        Id = c.Id,
        PersonaId = c.PersonaId,
        Codigo = c.Codigo,
        LimiteCredito = c.LimiteCredito,
        Descuento = c.Descuento,
        FormasPago = c.FormasPago,
        Observacion = c.Observacion,
        Activo = c.Activo
    };

    // Apply Update DTO -> Entity (partial update con valores no nulos)
    public static void ApplyUpdate(this Cliente c, ClienteUpdateDto dto)
    {
        if (dto.PersonaId.HasValue) c.PersonaId = dto.PersonaId.Value;
        if (!string.IsNullOrWhiteSpace(dto.Codigo)) c.Codigo = dto.Codigo!;
        if (dto.LimiteCredito.HasValue) c.LimiteCredito = dto.LimiteCredito.Value;
        if (dto.Descuento.HasValue) c.Descuento = dto.Descuento.Value;
        if (dto.FormasPago is not null) c.FormasPago = dto.FormasPago;
        if (dto.Observacion is not null) c.Observacion = dto.Observacion;
        if (dto.Activo.HasValue) c.Activo = dto.Activo.Value;
    }
}