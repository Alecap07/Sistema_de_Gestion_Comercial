namespace Domain.Entities
{
    public class TokenRecuperacion
    {
        public int IdToken { get; set; }
        public int IdUsuario { get; set; }
        public string Token { get; set; } = string.Empty;
        public string Estado { get; set; } = "pendiente";
        public DateTime FechaCreacion { get; set; }
        public DateTime FechaExpiracion { get; set; }
    }
}
