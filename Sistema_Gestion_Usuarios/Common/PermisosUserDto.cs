using System;

namespace Common
{
    public class PermisosUserDto
    {
        public int Id_User { get; set; }
        public int Id_Permi { get; set; }
        public DateTime? Fecha_Vto { get; set; }

        // Campos auxiliares para edición de clave primaria
        public int? Original_Id_User { get; set; }
        public int? Original_Id_Permi { get; set; }
    }
}
