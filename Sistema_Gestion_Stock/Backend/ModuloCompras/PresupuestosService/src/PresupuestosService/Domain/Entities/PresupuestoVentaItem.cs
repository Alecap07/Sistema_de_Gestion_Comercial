namespace PresupuestosService.Domain.Entities;

public class PresupuestoVentaItem
{
    public int Id { get; set; }
    public int PresupuestoVentaId { get; set; }
    public int ProductoId { get; set; }
    public int Cantidad { get; set; }
    public decimal PrecioUnitario { get; set; }
    public bool Activo { get; set; }
}