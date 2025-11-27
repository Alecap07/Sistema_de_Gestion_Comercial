namespace RemitosService.Domain.Entities;

public class DevolucionProveedor
{
    public int Id { get; set; }
    public int ProveedorId { get; set; }
    public DateTime Fecha { get; set; }
    public string Motivo { get; set; } = null!;
    public bool Activo { get; set; }
}