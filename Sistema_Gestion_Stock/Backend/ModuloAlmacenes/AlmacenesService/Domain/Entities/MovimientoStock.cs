using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Domain.Entities
{
    [Table("MovimientosStock")]
    public class MovimientoStock
    {
        [Key]
        [Column("IdMovimiento")]
        public int IdMovimiento { get; set; }

        [Required]
        [Column("Codigo")]
        public int Codigo { get; set; } // 🔹 FK a Productos(Codigo)

        [Column("IdOrden")]
        public int? IdOrden { get; set; }

        [Required]
        [Column("TipoMovimiento")]
        public string TipoMovimiento { get; set; } = string.Empty;

        [Required]
        [Column("Cantidad")]
        public int Cantidad { get; set; }

        [Column("FechaMovimiento")]
        public DateTime FechaMovimiento { get; set; } = DateTime.Now;

        [Column("Observaciones")]
        public string? Observaciones { get; set; }

        // 🔹 Relación con Producto (por Codigo)
        [ForeignKey(nameof(Codigo))]
        [JsonIgnore]
        public Producto? Producto { get; set; }
    }
}
