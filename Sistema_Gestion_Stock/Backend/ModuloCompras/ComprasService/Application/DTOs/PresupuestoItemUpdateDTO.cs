namespace ComprasService.Application.DTOs;

public class PresupuestoItemUpdateDTO
{
    public int PresupuestoId { get; set; }
    public int ProductoId { get; set; }
    public int Cantidad { get; set; }
    public decimal PrecioUnitario { get; set; }
    public bool Activo { get; set; }
}