namespace Common
{
    public class RespuestaUsuarioDto
    {
        public int IdRespuesta { get; set; }
        public int IdPregunta { get; set; }
        public string Texto { get; set; } = string.Empty; // Texto de la pregunta
        public string Respuesta { get; set; } = string.Empty; // Respuesta del usuario
    }
}