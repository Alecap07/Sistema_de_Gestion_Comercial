using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities
{
    [Table("Productos")]
    public class Producto
    {
        [Key]
        [Column("IdProducto")]
        public int IdProducto { get; set; }

        [Required]
        [Column("Codigo")]
        public int Codigo { get; set; }  // 🔹 Campo único usado en FKs

        [Required]
        [StringLength(100)]
        [Column("Nombre")]
        public string Nombre { get; set; } = string.Empty;

        [StringLength(255)]
        [Column("Descripcion")]
        public string? Descripcion { get; set; }

        [Required]
        [Column("Precio", TypeName = "decimal(10,2)")]
        public decimal Precio { get; set; }

        [Required]
        [Column("Stock")]
        public int Stock { get; set; }

        [Column("Lote")]
        public string? Lote { get; set; }

        [Column("FechaVencimiento")]
        public DateTime? FechaVencimiento { get; set; }

        [Column("Activo")]
        public bool Activo { get; set; } = true;

        [Column("FechaCreacion")]
        public DateTime FechaCreacion { get; set; } = DateTime.Now;

        // Relaciones
        public ICollection<MovimientoStock> MovimientosStock { get; set; } = new List<MovimientoStock>();
        public ICollection<Scrap> Scraps { get; set; } = new List<Scrap>();
    }
}
