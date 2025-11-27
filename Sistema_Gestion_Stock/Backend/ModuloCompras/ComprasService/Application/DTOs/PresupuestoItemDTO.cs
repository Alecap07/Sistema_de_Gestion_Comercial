namespace ComprasService.Application.DTOs;

public class PresupuestoItemDTO
{
    public int Id { get; set; }
    public int PresupuestoId { get; set; }
    public int ProductoId { get; set; }
    public int Cantidad { get; set; }
    public decimal PrecioUnitario { get; set; }
    public bool Activo { get; set; }
}