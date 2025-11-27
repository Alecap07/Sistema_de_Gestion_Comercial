namespace ProveedoresService.Application.DTOs;

public class ProveedorCreateDTO
{
    public int PersonaId { get; set; }
    public string Codigo { get; set; } = null!;
    public string RazonSocial { get; set; } = null!;
    public string? FormaPago { get; set; }
    public int? TiempoEntregaDias { get; set; }
    public string? DescuentosOtorgados { get; set; }
}