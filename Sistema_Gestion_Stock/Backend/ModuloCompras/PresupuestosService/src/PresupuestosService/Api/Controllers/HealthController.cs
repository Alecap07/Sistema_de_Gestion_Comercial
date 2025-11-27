using Microsoft.AspNetCore.Mvc;
using PresupuestosService.Infrastructure.Data;
using Microsoft.Data.SqlClient;
using System.Data;

namespace PresupuestosService.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly ISqlConnectionFactory _factory;
    private readonly IConfiguration _config;

    public HealthController(ISqlConnectionFactory factory, IConfiguration config)
    {
        _factory = factory;
        _config = config;
    }

    [HttpGet("db")]
    public IActionResult CheckDb()
    {
        var cs = _config.GetConnectionString("DefaultConnection") ?? string.Empty;
        var redacted = cs;
        // Ocultar password si presente
        try
        {
            var builder = new SqlConnectionStringBuilder(cs);
            if (!string.IsNullOrEmpty(builder.Password))
            {
                builder.Password = "****";
                redacted = builder.ToString();
            }
        }
        catch { /* ignore parse errors */ }

        try
        {
            using var conn = _factory.Create();
            var start = DateTime.UtcNow;
            conn.Open();
            var elapsedMs = (DateTime.UtcNow - start).TotalMilliseconds;
            return Ok(new
            {
                status = "ok",
                connection = redacted,
                openTimeMs = elapsedMs,
                serverVersion = (conn as SqlConnection)?.ServerVersion
            });
        }
        catch (SqlException ex)
        {
            return StatusCode(503, new
            {
                status = "error",
                connection = redacted,
                sqlNumber = ex.Number,
                message = ex.Message
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                status = "error",
                connection = redacted,
                message = ex.Message
            });
        }
    }
}