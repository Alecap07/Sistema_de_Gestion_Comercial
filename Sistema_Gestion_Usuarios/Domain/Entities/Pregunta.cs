namespace Domain.Entities
{
    public class Preguntas
    {
        public int Id { get; set; }
        public required string Texto { get; set; }
        public bool Activa { get; set; }
    }
}