using System.ComponentModel.DataAnnotations;

namespace ReservaProductosService.Application.DTOs;

public class ProductoReservadoUpdateDto
{
    public int? NotaPedidoVentaId { get; set; }
    public int? ProductoId { get; set; }
    public int? Cantidad { get; set; }
    public DateTime? FechaReserva { get; set; }
    public bool? Activo { get; set; }
}