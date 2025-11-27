namespace ReservaProductosService.Domain.Entities;

public class ProductoReservado
{
    public int Id { get; set; }
    public int NotaPedidoVentaId { get; set; }
    public int ProductoId { get; set; }
    public int Cantidad { get; set; }
    public DateTime FechaReserva { get; set; }
    public bool Activo { get; set; }
}