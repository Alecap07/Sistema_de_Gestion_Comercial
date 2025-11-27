using System.ComponentModel.DataAnnotations;

namespace PresupuestosService.Application.DTOs;

public class PresupuestoVentaCreateDto
{
    [Required]
    public int ClienteId { get; set; }

    [Required]
    public DateTime Fecha { get; set; }

    [Required, MaxLength(30)]
    public string Estado { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Observacion { get; set; }

    public bool Activo { get; set; } = true;
}