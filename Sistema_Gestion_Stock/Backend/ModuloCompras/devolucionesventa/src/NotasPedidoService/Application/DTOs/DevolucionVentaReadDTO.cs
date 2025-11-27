using System;
using System.Collections.Generic;

namespace DevolucionesService.Application.DTOs
{
    public class DevolucionVentaReadDTO
    {
        public int Id { get; set; }
        public int ClienteId { get; set; }
        public int? NotaPedidoVentaId { get; set; }
        public DateTime Fecha { get; set; }
        public string? Motivo { get; set; }
        public bool Activo { get; set; }
        public List<DevolucionVentaItemReadDTO> Items { get; set; } = new List<DevolucionVentaItemReadDTO>();
    }
}
