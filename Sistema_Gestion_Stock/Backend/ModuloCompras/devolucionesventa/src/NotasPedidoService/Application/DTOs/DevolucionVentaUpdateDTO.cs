using System;

namespace DevolucionesService.Application.DTOs
{
    public class DevolucionVentaUpdateDTO
    {
        public int? ClienteId { get; set; }
        public int? NotaPedidoVentaId { get; set; }
        public DateTime? Fecha { get; set; }
        public string? Motivo { get; set; }
        public bool? Activo { get; set; }
    }
}
