namespace NotasPedidoService.Application.DTOs
{
    public class NotaPedidoVentaReadDTO
    {
        public int Id { get; set; }
        public int ClienteId { get; set; }
        public DateTime Fecha { get; set; }
        public string Estado { get; set; } = string.Empty;
        public string Observacion { get; set; } = string.Empty;
        public bool Activo { get; set; }
         public List<NotaPedidoVentaItemReadDTO> Items { get; set; } = new List<NotaPedidoVentaItemReadDTO>();
    }

    public class NotaPedidoVentaUpdateDTO
    {
        public string? Observacion { get; set; }
        public string? Estado { get; set; }
        public DateTime? Fecha { get; set; }
        public bool Activo { get; set; }
    }
}
