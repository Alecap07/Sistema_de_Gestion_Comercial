namespace Application.DTOs
{
    public class ScrapDTO
    {
        public int IdScrap { get; set; }

 
        public int Codigo { get; set; }
        public string? NombreProducto { get; set; }  


        public int? IdUsuario { get; set; }
        public string? NombreUsuario { get; set; }   

        public int Cantidad { get; set; }
        public string Motivo { get; set; } = null!;
        public string? Observaciones { get; set; }

        public DateTime FechaScrap { get; set; }
    }
}
