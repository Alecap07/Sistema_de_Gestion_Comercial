namespace ComprasService.Application.DTOs;

public class OrdenCompraDTO
{
    public int Id { get; set; }
    public int ProveedorId { get; set; }
    public DateTime Fecha { get; set; }
    public string Estado { get; set; } = null!;
    public string? Observacion { get; set; }
    public bool Activo { get; set; }
}