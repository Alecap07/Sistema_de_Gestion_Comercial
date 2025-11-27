// placeholder
namespace FacturasService.Application.DTOs;

public class FacturaCompraDTO
{
    public int Id { get; set; }
    public int ProveedorId { get; set; }
    public string? NumeroFactura { get; set; }
    public DateTime Fecha { get; set; }
    public decimal Total { get; set; }
    public bool Activo { get; set; }
}