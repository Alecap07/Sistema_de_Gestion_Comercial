namespace ComprasService.Application.DTOs;

public class OrdenCompraUpdateDTO
{
    public int ProveedorId { get; set; }
    public DateTime Fecha { get; set; }
    public string Estado { get; set; } = null!;
    public string? Observacion { get; set; }
    public bool Activo { get; set; }
}