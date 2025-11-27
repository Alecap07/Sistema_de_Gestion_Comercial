using System;

namespace Domain.Entities
{
    public class Persona
    {
        public int Id { get; set; }
        public int Legajo { get; set; }
        public string? Nombre { get; set; }
        public string? Apellido { get; set; }
        public string? Capitulo { get; set; }
        public string? Tipo_Doc { get; set; }
        public string? Num_Doc { get; set; }
        public string? Cuil { get; set; }
        public string? Calle { get; set; }
        public string? Altura { get; set; }
        public int Cod_Post { get; set; }

        // FK ids
        public int Id_Provi { get; set; }
        public int Id_Partido { get; set; }
        public int Id_Local { get; set; }
        public int Genero { get; set; }

        // Nombres relacionados (para joins)
        public string? ProvinciaNombre { get; set; }
        public string? PartidoNombre { get; set; }
        public string? LocalidadNombre { get; set; }
        public string? GeneroNombre { get; set; }

        public string? Telefono { get; set; }
        public string? Email_Personal { get; set; }
    }
}
