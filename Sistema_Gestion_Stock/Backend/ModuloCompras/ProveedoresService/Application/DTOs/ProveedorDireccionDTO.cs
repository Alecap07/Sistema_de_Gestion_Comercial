namespace ProveedoresService.Application.DTOs;

public class ProveedorDireccionDTO
{
    public int Id { get; set; }
    public int ProveedorId { get; set; }
    public string Calle { get; set; } = null!;
    public string? Altura { get; set; }
    public string? Localidad { get; set; }
    public string? Observacion { get; set; }
    public bool Activo { get; set; }
}