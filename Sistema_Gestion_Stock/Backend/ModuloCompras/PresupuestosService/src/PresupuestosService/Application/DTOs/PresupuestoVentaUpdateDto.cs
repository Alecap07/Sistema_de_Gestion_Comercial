using System.ComponentModel.DataAnnotations;

namespace PresupuestosService.Application.DTOs;

public class PresupuestoVentaUpdateDto
{
    public int? ClienteId { get; set; }
    public DateTime? Fecha { get; set; }
    [MaxLength(30)]
    public string? Estado { get; set; }
    [MaxLength(500)]
    public string? Observacion { get; set; }
    public bool? Activo { get; set; }
}