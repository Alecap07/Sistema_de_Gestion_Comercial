namespace ComprasService.Domain.Entities;

public class Presupuesto
{
    public int Id { get; set; }
    public int ProveedorId { get; set; }
    public DateTime Fecha { get; set; }
    public string Estado { get; set; } = null!;
    public string? Observacion { get; set; }
    public bool Activo { get; set; }
}