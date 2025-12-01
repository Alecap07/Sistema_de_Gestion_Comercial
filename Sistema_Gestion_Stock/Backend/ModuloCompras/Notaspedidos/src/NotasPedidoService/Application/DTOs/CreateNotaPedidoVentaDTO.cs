using System;
using System.Collections.Generic;

namespace NotasPedidoService.Application.DTOs
{
    public class NotaPedidoVentaCreateDTO
    {
        public int ClienteId { get; set; }
        public string Observacion { get; set; } = string.Empty;
        public DateTime? Fecha { get; set; }
        public bool Activo { get; set; } = true;

        public List<NotaPedidoVentaItemCreateDTO> Items { get; set; } = new List<NotaPedidoVentaItemCreateDTO>();
    }
}
