using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Domain.Entities
{
    [Table("Scrap")]
    public class Scrap
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("IdScrap")]
        public int IdScrap { get; set; }

        [Required]
        [Column("Codigo")]
        public int Codigo { get; set; }  
        [Column("Cantidad")]
        public int Cantidad { get; set; }

        [Required]
        [Column("Motivo")]
        public string Motivo { get; set; } = string.Empty;

        [Column("IdUsuario")]
        public int? IdUsuario { get; set; }

        [Column("FechaScrap")]
        public DateTime FechaScrap { get; set; } = DateTime.Now;

        [Column("Observaciones")]
        public string? Observaciones { get; set; }

        
        [JsonIgnore]
        public Producto? Producto { get; set; }
    }
}
