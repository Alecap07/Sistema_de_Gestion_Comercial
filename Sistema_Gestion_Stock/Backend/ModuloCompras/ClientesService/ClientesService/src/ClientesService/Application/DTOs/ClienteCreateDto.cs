using System.ComponentModel.DataAnnotations;

namespace ClientesService.Application.DTOs;

public class ClienteCreateDto
{
    [Required]
    public int PersonaId { get; set; }

    [Required, MaxLength(50)]
    public string Codigo { get; set; } = string.Empty;

    public decimal LimiteCredito { get; set; }
    public decimal Descuento { get; set; }

    [MaxLength(200)]
    public string? FormasPago { get; set; }

    [MaxLength(500)]
    public string? Observacion { get; set; }
}