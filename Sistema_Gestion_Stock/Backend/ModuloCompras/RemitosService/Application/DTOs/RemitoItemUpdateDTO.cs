namespace RemitosService.Application.DTOs;

public class RemitoItemUpdateDTO
{
    public int RemitoId { get; set; }
    public int ProductoId { get; set; }
    public int Cantidad { get; set; }
    public bool Activo { get; set; }
}