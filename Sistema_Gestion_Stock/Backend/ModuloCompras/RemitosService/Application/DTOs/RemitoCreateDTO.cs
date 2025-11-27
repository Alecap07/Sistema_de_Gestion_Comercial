namespace RemitosService.Application.DTOs;

public class RemitoCreateDTO
{
    public int? OrdenCompraId { get; set; }
    public int ProveedorId { get; set; }
    public DateTime Fecha { get; set; }
    public string? Observacion { get; set; }
}