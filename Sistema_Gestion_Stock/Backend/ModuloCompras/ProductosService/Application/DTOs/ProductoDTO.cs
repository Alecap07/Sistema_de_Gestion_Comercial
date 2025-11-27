namespace ProductosService.Application.DTOs;

public class ProductoDTO
{
    public int Id { get; set; }
    public string Codigo { get; set; } = default!;
    public string Nombre { get; set; } = default!;
    public int CategoriaId { get; set; }
    public int MarcaId { get; set; }
    public string? Descripcion { get; set; }
    public string? Lote { get; set; }
    public DateTime? FechaVencimiento { get; set; }
    public int? UnidadesAviso { get; set; }
    public decimal PrecioCompra { get; set; }
    public decimal? PrecioVenta { get; set; }
    public int StockActual { get; set; }
    public int? StockMinimo { get; set; }
    public int? StockIdeal { get; set; }
    public int? StockMaximo { get; set; }
    public string? TipoStock { get; set; }
    public bool Activo { get; set; }
}

public class ProductoCreateDTO
{
    public string Codigo { get; set; } = default!;
    public string Nombre { get; set; } = default!;
    public int CategoriaId { get; set; }
    public int MarcaId { get; set; }
    public string? Descripcion { get; set; }
    public string? Lote { get; set; }
    public DateTime? FechaVencimiento { get; set; }
    public int? UnidadesAviso { get; set; }
    public decimal PrecioCompra { get; set; }
    public decimal? PrecioVenta { get; set; }
    public int StockActual { get; set; }
    public int? StockMinimo { get; set; }
    public int? StockIdeal { get; set; }
    public int? StockMaximo { get; set; }
    public string? TipoStock { get; set; }
}

public class ProductoUpdateDTO : ProductoCreateDTO
{
    public bool Activo { get; set; }
}