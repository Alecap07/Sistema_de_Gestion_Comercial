// placeholder
namespace FacturasService.Domain.Entities;

public class NotaDebito
{
    public int Id { get; set; }
    public int ProveedorId { get; set; }
    public DateTime Fecha { get; set; }
    public string Motivo { get; set; } = null!;
    public decimal Monto { get; set; }
    public int? FacturaId { get; set; }
    public bool Activo { get; set; }
}