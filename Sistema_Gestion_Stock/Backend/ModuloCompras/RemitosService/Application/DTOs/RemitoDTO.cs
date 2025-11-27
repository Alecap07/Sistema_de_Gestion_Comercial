namespace RemitosService.Application.DTOs;

public class RemitoDTO
{
    public int Id { get; set; }
    public int? OrdenCompraId { get; set; }
    public int ProveedorId { get; set; }
    public DateTime Fecha { get; set; }
    public string? Observacion { get; set; }
    public bool Activo { get; set; }
}