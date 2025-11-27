namespace ComprasService.Application.DTOs;

public class PresupuestoCreateDTO
{
    public int ProveedorId { get; set; }
    public DateTime Fecha { get; set; }
    public string Estado { get; set; } = null!;
    public string? Observacion { get; set; }
}