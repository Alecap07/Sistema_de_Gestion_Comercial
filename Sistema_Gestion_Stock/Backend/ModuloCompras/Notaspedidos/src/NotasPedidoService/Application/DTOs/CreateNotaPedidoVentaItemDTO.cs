namespace NotasPedidoService.Application.DTOs
{
    public class NotaPedidoVentaItemCreateDTO
    {
        public int NotaPedidoVentaId { get; set; } 
        public int ProductoId { get; set; }
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public bool Activo { get; set; } = true;
    }
}
