namespace ProductosService.Domain.Entities;

public sealed class Marca
{
    public int Id { get; set; }
    public string Nombre { get; set; } = default!;
    public bool Activo { get; set; }
}