using System.ComponentModel.DataAnnotations;

namespace PresupuestosService.Application.DTOs;

public class PresupuestoVentaItemCreateDto
{
    [Required]
    public int PresupuestoVentaId { get; set; }

    [Required]
    public int ProductoId { get; set; }

    [Required]
    public int Cantidad { get; set; }

    [Required]
    public decimal PrecioUnitario { get; set; }

    public bool Activo { get; set; } = true;
}