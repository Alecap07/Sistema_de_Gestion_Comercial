namespace ProveedoresService.Application.DTOs;

public class CategoriaUpdateDTO
{
    public string Nombre { get; set; } = null!;
    public string? Descripcion { get; set; }
    public bool Activo { get; set; }
}