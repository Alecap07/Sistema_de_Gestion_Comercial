namespace ProveedoresService.Application.DTOs;

public class ProveedorProductoDTO
{
    public int Id { get; set; }
    public int ProveedorId { get; set; }
    public int ProductoId { get; set; }
    public decimal PrecioCompra { get; set; }
    public string? CatalogoUrl { get; set; }
    public DateTime? FechaDesde { get; set; }
    public bool Activo { get; set; }
}