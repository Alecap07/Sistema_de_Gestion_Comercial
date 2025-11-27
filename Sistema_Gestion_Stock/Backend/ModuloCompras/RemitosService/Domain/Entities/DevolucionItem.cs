namespace RemitosService.Domain.Entities;

public class DevolucionItem
{
    public int Id { get; set; }
    public int DevolucionId { get; set; }
    public int ProductoId { get; set; }
    public int Cantidad { get; set; }
    public bool Activo { get; set; }
}