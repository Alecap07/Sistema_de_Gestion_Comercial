namespace RemitosService.Application.DTOs;

public class DevolucionProveedorCreateDTO
{
    public int ProveedorId { get; set; }
    public DateTime Fecha { get; set; }
    public string Motivo { get; set; } = null!;
}