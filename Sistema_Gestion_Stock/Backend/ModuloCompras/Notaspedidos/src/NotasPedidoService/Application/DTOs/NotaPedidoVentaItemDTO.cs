namespace NotasPedidoService.Application.DTOs
{
    public class NotaPedidoVentaItemReadDTO
    {
        public int Id { get; set; }
        public int NotaPedidoVentaId { get; set; }
        public int ProductoId { get; set; }
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public bool Activo { get; set; }    
    }

    public class NotaPedidoVentaItemUpdateDTO
    {
        public int? ProductoId { get; set; }
        public int? Cantidad { get; set; }
        public decimal? PrecioUnitario { get; set; }
        public bool Activo { get; set; }
    }
}
