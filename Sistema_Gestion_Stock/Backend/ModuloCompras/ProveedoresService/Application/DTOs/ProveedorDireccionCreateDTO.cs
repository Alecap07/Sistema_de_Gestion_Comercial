namespace ProveedoresService.Application.DTOs;

public class ProveedorDireccionCreateDTO
{
    public string Calle { get; set; } = null!;
    public string? Altura { get; set; }
    public string? Localidad { get; set; }
    public string? Observacion { get; set; }
}