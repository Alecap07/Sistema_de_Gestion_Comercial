using System.ComponentModel.DataAnnotations;

namespace ReservaProductosService.Application.DTOs;

public class ProductoReservadoCreateDto
{
    [Required]
    public int NotaPedidoVentaId { get; set; }

    [Required]
    public int ProductoId { get; set; }

    [Required]
    public int Cantidad { get; set; }

    [Required]
    public DateTime FechaReserva { get; set; }

    public bool Activo { get; set; } = true;
}