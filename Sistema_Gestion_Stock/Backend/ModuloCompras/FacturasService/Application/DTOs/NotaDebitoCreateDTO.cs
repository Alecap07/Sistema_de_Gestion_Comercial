// placeholder
namespace FacturasService.Application.DTOs;

public class NotaDebitoCreateDTO
{
    public int ProveedorId { get; set; }
    public DateTime Fecha { get; set; }
    public string Motivo { get; set; } = null!;
    public decimal Monto { get; set; }
    public int? FacturaId { get; set; }
}