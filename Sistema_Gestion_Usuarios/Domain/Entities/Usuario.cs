namespace Domain.Entities
{
    public class Usuario
    {
        public int Id { get; set; }
        public string? Nombre_Usuario { get; set; }
        public string? Contraseña { get; set; }
        public DateTime? Fecha_Block { get; set; }
        public bool Usuario_Bloqueado { get; set; }
        public DateTime? Fecha_Usu_Cambio { get; set; }
        public int Id_Rol { get; set; }
        public int Id_Per { get; set; }
        public bool PrimeraVez { get; set; }

        // 🔹 NUEVO: propiedad de navegación a Persona
        public Persona? Persona { get; set; }
    }
}
