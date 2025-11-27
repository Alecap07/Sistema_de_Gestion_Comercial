namespace RemitosService.Application.DTOs;

public class DevolucionItemUpdateDTO
{
    public int DevolucionId { get; set; }
    public int ProductoId { get; set; }
    public int Cantidad { get; set; }
    public bool Activo { get; set; }
}