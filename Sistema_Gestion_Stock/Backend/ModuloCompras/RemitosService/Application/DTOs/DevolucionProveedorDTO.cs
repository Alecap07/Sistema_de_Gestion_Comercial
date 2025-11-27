namespace RemitosService.Application.DTOs;

public class DevolucionProveedorDTO
{
    public int Id { get; set; }
    public int ProveedorId { get; set; }
    public DateTime Fecha { get; set; }
    public string Motivo { get; set; } = null!;
    public bool Activo { get; set; }
}