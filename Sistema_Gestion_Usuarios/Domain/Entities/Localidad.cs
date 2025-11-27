namespace Domain.Entities
{
    public class Localidad
    {
        public int Id { get; set; }
        public required string Nom_Local { get; set; }
        public int Id_Parti { get; set; }
    }
}
