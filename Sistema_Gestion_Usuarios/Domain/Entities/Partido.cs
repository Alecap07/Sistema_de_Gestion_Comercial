namespace Domain.Entities
{
    public class Partido
    {
        public int Id { get; set; }
        public required string Nom_Partido { get; set; }
        public int Id_Prov { get; set; }
    }
}
