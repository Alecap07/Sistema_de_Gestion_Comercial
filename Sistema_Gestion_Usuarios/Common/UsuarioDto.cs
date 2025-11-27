namespace Common
{
    public class UsuarioDto
    {
        public int Id { get; set; }
        public string? Nombre_Usuario { get; set; }
        public int Id_Rol { get; set; }
        public int Id_Per { get; set; }
        public string? Nombre_Persona { get; set; }
        public bool Usuario_Bloqueado { get; set; }
        public bool PrimeraVez { get; set; }
        public DateTime? Fecha_Block { get; set; }
        public DateTime? Fecha_Ult_Cambio { get; set; }
    }
}