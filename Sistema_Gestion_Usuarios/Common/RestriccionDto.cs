namespace Common
{
    public class RestriccionDto
    {
        public int Id { get; set; }
        public string? Cod_Restri { get; set; }
        public string? Descripcion { get; set; }
        public int Id_TipoRestri { get; set; }
        public bool Activa { get; set; }
        public int Cantidad { get; set; }
    }
}
