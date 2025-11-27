namespace ProveedoresService.Application.DTOs;

public class ProveedorCategoriaDTO
{
    public int Id { get; set; }
    public int ProveedorId { get; set; }
    public int CategoriaId { get; set; }
    public bool Activo { get; set; }
}