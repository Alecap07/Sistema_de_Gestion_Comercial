namespace RemitosService.Domain.Entities;

public class RemitoItem
{
    public int Id { get; set; }
    public int RemitoId { get; set; }
    public int ProductoId { get; set; }
    public int Cantidad { get; set; }
    public bool Activo { get; set; }
}