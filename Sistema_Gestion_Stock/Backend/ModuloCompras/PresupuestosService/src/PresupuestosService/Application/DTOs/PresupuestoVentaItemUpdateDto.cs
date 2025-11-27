namespace PresupuestosService.Application.DTOs;

public class PresupuestoVentaItemUpdateDto
{
    public int? PresupuestoVentaId { get; set; }
    public int? ProductoId { get; set; }
    public int? Cantidad { get; set; }
    public decimal? PrecioUnitario { get; set; }
    public bool? Activo { get; set; }
}