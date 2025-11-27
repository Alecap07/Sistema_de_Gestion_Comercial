using System;

namespace NotasDebitoService.Application.DTOs
{
    public class NotaDebitoVentaCreateDTO
    {
        public int ClienteId { get; set; }
        public DateTime Fecha { get; set; }
        public string? Motivo { get; set; }
        public decimal Monto { get; set; }
        public int? NotaPedidoVentaId { get; set; }
        public bool Activo { get; set; } = true;
    }
}
