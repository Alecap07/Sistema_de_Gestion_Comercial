namespace ComprasService.Application.DTOs;

public class PresupuestoItemCreateDTO
{
    public int PresupuestoId { get; set; }
    public int ProductoId { get; set; }
    public int Cantidad { get; set; }
    public decimal PrecioUnitario { get; set; }
}