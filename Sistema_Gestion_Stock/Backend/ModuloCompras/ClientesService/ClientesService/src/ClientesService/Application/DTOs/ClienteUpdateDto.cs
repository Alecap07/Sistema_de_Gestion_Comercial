using System.ComponentModel.DataAnnotations;

namespace ClientesService.Application.DTOs;

public class ClienteUpdateDto
{
    public int? PersonaId { get; set; }

    [MaxLength(50)]
    public string? Codigo { get; set; }

    public decimal? LimiteCredito { get; set; }
    public decimal? Descuento { get; set; }

    [MaxLength(200)]
    public string? FormasPago { get; set; }

    [MaxLength(500)]
    public string? Observacion { get; set; }

    public bool? Activo { get; set; }
}