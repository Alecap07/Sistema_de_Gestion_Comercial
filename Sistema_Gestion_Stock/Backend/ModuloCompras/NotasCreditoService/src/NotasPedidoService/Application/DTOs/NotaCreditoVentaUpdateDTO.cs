using System;

namespace NotasCreditoService.Application.DTOs
{
    public class NotaCreditoVentaUpdateDTO
    {
        public int? ClienteId { get; set; }
        public DateTime? Fecha { get; set; }
        public string? Motivo { get; set; }
        public decimal? Monto { get; set; }
        public int? NotaPedidoVentaId { get; set; }
        public bool? Activo { get; set; }
    }
}
