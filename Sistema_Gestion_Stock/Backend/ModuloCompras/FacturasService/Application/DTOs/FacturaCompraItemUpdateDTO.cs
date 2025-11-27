// placeholder
namespace FacturasService.Application.DTOs;

public class FacturaCompraItemUpdateDTO
{
    public int FacturaId { get; set; }
    public int ProductoId { get; set; }
    public int Cantidad { get; set; }
    public decimal PrecioUnitario { get; set; }
    public bool Activo { get; set; }
}