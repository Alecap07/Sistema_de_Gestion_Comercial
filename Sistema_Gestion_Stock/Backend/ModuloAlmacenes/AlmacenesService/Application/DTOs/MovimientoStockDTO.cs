namespace Application.DTOs
{
    public class MovimientoStockDTO
    {
        public int IdMovimiento { get; set; }

        public int Codigo { get; set; }
        public string? NombreProducto { get; set; }  // útil para el front

        public int? IdOrden { get; set; }
        public string TipoMovimiento { get; set; } = null!;
        public int Cantidad { get; set; }

        public DateTime FechaMovimiento { get; set; }
        public string? Observaciones { get; set; }
    }
}
