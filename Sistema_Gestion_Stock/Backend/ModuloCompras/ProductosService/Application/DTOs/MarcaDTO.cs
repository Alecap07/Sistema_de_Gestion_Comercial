namespace ProductosService.Application.DTOs;

public class MarcaDTO
{
    public int Id { get; set; }
    public string Nombre { get; set; } = default!;
    public bool Activo { get; set; }
}

public class MarcaCreateDTO
{
    public string Nombre { get; set; } = default!;
}

public class MarcaUpdateDTO : MarcaCreateDTO
{
    public bool Activo { get; set; }
}