namespace ProveedoresService.Domain.Entities;

public class ProveedorCategoria
{
    public int Id { get; set; }
    public int ProveedorId { get; set; }
    public int CategoriaId { get; set; }
    public bool Activo { get; set; }
}