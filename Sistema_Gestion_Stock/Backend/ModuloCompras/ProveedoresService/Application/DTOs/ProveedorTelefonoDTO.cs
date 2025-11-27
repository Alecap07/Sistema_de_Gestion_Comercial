namespace ProveedoresService.Application.DTOs;

public class ProveedorTelefonoDTO
{
    public int Id { get; set; }
    public int ProveedorId { get; set; }
    public string Telefono { get; set; } = null!;
    public string? Observacion { get; set; }
    public bool Activo { get; set; }
}