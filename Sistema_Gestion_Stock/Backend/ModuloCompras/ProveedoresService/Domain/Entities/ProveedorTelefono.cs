namespace ProveedoresService.Domain.Entities;

public class ProveedorTelefono
{
    public int Id { get; set; }
    public int ProveedorId { get; set; }
    public string Telefono { get; set; } = null!;
    public string? Observacion { get; set; }
    public bool Activo { get; set; }
}