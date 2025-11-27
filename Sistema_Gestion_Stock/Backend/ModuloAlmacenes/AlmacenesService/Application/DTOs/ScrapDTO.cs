namespace Application.DTOs
{
    public class ScrapDTO
    {
        public int IdScrap { get; set; }

        // Relación con Productos
        public int Codigo { get; set; }
        public string? NombreProducto { get; set; }  // opcional para mostrar en el front

        // Usuario que deriva al scrap
        public int? IdUsuario { get; set; }
        public string? NombreUsuario { get; set; }   // opcional para mostrar en el front

        // Datos del movimiento
        public int Cantidad { get; set; }
        public string Motivo { get; set; } = null!;
        public string? Observaciones { get; set; }

        public DateTime FechaScrap { get; set; }
    }
}
