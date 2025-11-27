namespace ProductosService.Application.DTOs;

public class CategoriaDTO
{
    public int Id { get; set; }
    public string Nombre { get; set; } = default!;
    public bool Activo { get; set; }
}

public class CategoriaCreateDTO
{
    public string Nombre { get; set; } = default!;
}

public class CategoriaUpdateDTO : CategoriaCreateDTO
{
    public bool Activo { get; set; }
}