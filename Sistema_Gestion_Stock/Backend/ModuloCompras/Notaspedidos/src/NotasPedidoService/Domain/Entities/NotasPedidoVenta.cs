namespace NotasPedidoService.Domain.Entities

{
    public class NotaPedidoVenta
    {
        public int Id { get; set; }
        public int ClienteId { get; set; }
        public DateTime Fecha { get; set; }
        public string Estado { get; set; } = "Creado";
        public string Observacion { get; set; } = string.Empty;
        public bool Activo { get; set; }
    }
}
