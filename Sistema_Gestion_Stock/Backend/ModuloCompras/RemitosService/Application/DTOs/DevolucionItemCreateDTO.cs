namespace RemitosService.Application.DTOs;

public class DevolucionItemCreateDTO
{
    public int DevolucionId { get; set; }
    public int ProductoId { get; set; }
    public int Cantidad { get; set; }
}