namespace Domain.Dtos
{
    // DTO para solicitar recuperación de contraseña (envía usuario o email)
    public class SolicitarRecuperacionDto
    {
        public string Nombre_Usuario { get; set; } = string.Empty;
    }

    // DTO para mostrar las preguntas de recuperación
    public class PreguntaRecuperacionDto
    {
        public int Id_Pregun { get; set; }
        public string Pregunta { get; set; } = string.Empty;
    }

    // DTO para enviar una respuesta a una pregunta de recuperación
    public class PreguntaRespuestaRecuperacionDto
    {
        public int Id_Pregun { get; set; }
        public string Respuesta { get; set; } = string.Empty;
    }

    // DTO para validar varias respuestas con un token
    public class ValidarRespuestasRecuperacionDto
    {
        public string Token { get; set; } = string.Empty;
        public List<PreguntaRespuestaRecuperacionDto> Respuestas { get; set; } = new();
    }

    // DTO para cambiar la contraseña usando un token
    public class CambiarContrasenaRecuperacionDto
    {
        public string Token { get; set; } = string.Empty;
        public string NuevaContraseña { get; set; } = string.Empty;
    }
}
