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

        // Referencia a los items usando el DTO definido en CreateNotaPedidoVentaItemDTO.cs
        public List<NotaPedidoVentaItemCreateDTO> Items { get; set; } = new List<NotaPedidoVentaItemCreateDTO>();
    }
}
