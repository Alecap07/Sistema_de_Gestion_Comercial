namespace ClientesService.Application.DTOs;

public class ClienteReadDto
{
    public int Id { get; set; }
    public int PersonaId { get; set; }
    public string Codigo { get; set; } = string.Empty;
    public decimal LimiteCredito { get; set; }
    public decimal Descuento { get; set; }
    public string? FormasPago { get; set; }
    public string? Observacion { get; set; }
    public bool Activo { get; set; }
}