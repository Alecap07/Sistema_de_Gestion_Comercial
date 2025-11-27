namespace ProveedoresService.Application.DTOs;

public class ProveedorProductoCreateDTO
{
    public int ProductoId { get; set; }
    public decimal PrecioCompra { get; set; }
    public string? CatalogoUrl { get; set; }
    public DateTime? FechaDesde { get; set; }
}