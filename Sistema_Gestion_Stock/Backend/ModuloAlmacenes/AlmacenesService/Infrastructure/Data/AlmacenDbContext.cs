using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class AlmacenDbContext : DbContext
    {
        public AlmacenDbContext(DbContextOptions<AlmacenDbContext> options) 
            : base(options) { }

        public DbSet<Producto> Productos { get; set; }
        public DbSet<MovimientoStock> MovimientosStock { get; set; }
        public DbSet<Scrap> Scrap { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 🔹 Clave alternativa para Codigo en Producto
            modelBuilder.Entity<Producto>()
                .HasAlternateKey(p => p.Codigo);

            // 🔹 Relación Scrap -> Producto usando Codigo como FK
            modelBuilder.Entity<Scrap>()
                .HasOne(s => s.Producto)
                .WithMany(p => p.Scraps)
                .HasForeignKey(s => s.Codigo)
                .HasPrincipalKey(p => p.Codigo)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
