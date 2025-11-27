namespace Common
{
    public class CambiarContrasenaDtoCommon
    {
        public string Token { get; set; } = string.Empty;

        // Coincide con lo que envía React: "NuevaContraseña"
        public string NuevaContraseña { get; set; } = string.Empty;
    }
}
