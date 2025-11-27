// placeholder
namespace FacturasService.Application.DTOs;

public class FacturaCompraCreateDTO
{
    public int ProveedorId { get; set; }
    public string? NumeroFactura { get; set; }
    public DateTime Fecha { get; set; }
    public decimal Total { get; set; }
}