namespace ProveedoresService.Application.DTOs;

public class ProveedorTelefonoUpdateDTO
{
    public string Telefono { get; set; } = null!;
    public string? Observacion { get; set; }
    public bool Activo { get; set; }
}