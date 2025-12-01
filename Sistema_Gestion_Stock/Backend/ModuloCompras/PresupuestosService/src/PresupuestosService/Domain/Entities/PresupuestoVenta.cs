namespace PresupuestosService.Domain.Entities;

public class PresupuestoVenta
{
    public int Id { get; set; }
    public int ClienteId { get; set; }
    public DateTime Fecha { get; set; }
    public string Estado { get; set; } = string.Empty;
    public string? Observacion { get; set; }
    public bool Activo { get; set; }

    public List<PresupuestoVentaItem> Items { get; set; } = new();
}