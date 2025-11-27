using System;

namespace Domain.Entities
{
    public class PermisosUser
    {
        public int Id_User { get; set; }
        public int Id_Permi { get; set; }
        public DateTime? Fecha_Vto { get; set; }
        public int? Original_Id_User { get; set; }
        public int? Original_Id_Permi { get; set; }
    }
}
