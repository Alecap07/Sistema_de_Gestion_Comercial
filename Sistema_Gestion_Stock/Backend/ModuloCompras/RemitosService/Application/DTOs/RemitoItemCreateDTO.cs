namespace RemitosService.Application.DTOs;

public class RemitoItemCreateDTO
{
    public int RemitoId { get; set; }
    public int ProductoId { get; set; }
    public int Cantidad { get; set; }
}