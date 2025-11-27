// placeholder
namespace FacturasService.Domain.Entities;

public class FacturaCompraRemito
{
    public int Id { get; set; }
    public int FacturaId { get; set; }
    public int RemitoId { get; set; }
    public bool Activo { get; set; }
}