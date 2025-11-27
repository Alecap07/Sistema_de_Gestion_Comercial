namespace ReservaProductosService.Application.DTOs;

public class ProductoReservadoReadDto
{
    public int Id { get; set; }
    public int NotaPedidoVentaId { get; set; }
    public int ProductoId { get; set; }
    public int Cantidad { get; set; }
    public DateTime FechaReserva { get; set; }
    public bool Activo { get; set; }
}