using System;

namespace DevolucionesService.Application.DTOs
{
    public class DevolucionVentaItemReadDTO
    {
        public int Id { get; set; }
        public int DevolucionVentaId { get; set; }
        public int ProductoId { get; set; }
        public int Cantidad { get; set; }
        public bool Activo { get; set; }
    }
}
