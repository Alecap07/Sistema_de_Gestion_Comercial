namespace ProveedoresService.Domain.Entities;

public class Proveedor
{
    public int Id { get; set; }
    public int PersonaId { get; set; }
    public string Codigo { get; set; } = null!;
    public string RazonSocial { get; set; } = null!;
    public string? FormaPago { get; set; }
    public int? TiempoEntregaDias { get; set; }
    public string? DescuentosOtorgados { get; set; }
    public bool Activo { get; set; }

    // Relaciones (navegación) opcionales
    public List<ProveedorTelefono>? Telefonos { get; set; }
    public List<ProveedorDireccion>? Direcciones { get; set; }
    public List<ProveedorCategoria>? Categorias { get; set; }
    public List<ProveedorProducto>? Productos { get; set; }
}