using System;

namespace DevolucionesService.Domain.Entities
{
    public class DevolucionVenta
    {
        public int Id { get; set; }
        public int ClienteId { get; set; }
        public int? NotaPedidoVentaId { get; set; }
        public DateTime Fecha { get; set; }
        public string? Motivo { get; set; }
        public bool Activo { get; set; }
    }
}
