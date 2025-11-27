// placeholder
using System.Data;
using Microsoft.Data.SqlClient;
using FacturasService.Common.Abstractions;
using FacturasService.Common.Enums;
using FacturasService.Domain.Entities;
using FacturasService.Domain.Interfaces;

namespace FacturasService.Infrastructure.Repositories;

public sealed class NotaCreditoRepository : INotaCreditoRepository
{
    private readonly IDbConnectionFactory _factory;
    public NotaCreditoRepository(IDbConnectionFactory factory) => _factory = factory;

    public async Task<NotaCredito?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        using var conn = _factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_NotasCredito_GetById", (SqlConnection)conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@Id", id);
            if (conn is SqlConnection sqlConn) await sqlConn.OpenAsync(ct); else conn.Open();
        using var r = await cmd.ExecuteReaderAsync(ct);
        if (!await r.ReadAsync(ct)) return null;
        return Map(r);
    }

    public async Task<IEnumerable<NotaCredito>> SearchAsync(
        int? proveedorId,
        int? facturaId,
        DateTime? fechaDesde,
        DateTime? fechaHasta,
        EstadoFiltro estadoFiltro,
        CancellationToken ct = default)
    {
        using var conn = _factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_NotasCredito_Search", (SqlConnection)conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@ProveedorId", (object?)proveedorId ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@FacturaId", (object?)facturaId ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@FechaDesde", (object?)fechaDesde ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@FechaHasta", (object?)fechaHasta ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@EstadoFiltro", (byte)estadoFiltro);
            if (conn is SqlConnection sqlConn) await sqlConn.OpenAsync(ct); else conn.Open();
        using var r = await cmd.ExecuteReaderAsync(ct);
        var list = new List<NotaCredito>();
        while (await r.ReadAsync(ct))
        {
            list.Add(Map(r));
        }
        return list;
    }

    public async Task<int> CreateAsync(NotaCredito entity, CancellationToken ct = default)
    {
        using var conn = _factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_NotasCredito_Create", (SqlConnection)conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@ProveedorId", entity.ProveedorId);
        cmd.Parameters.AddWithValue("@Fecha", entity.Fecha);
        cmd.Parameters.AddWithValue("@Motivo", entity.Motivo);
        cmd.Parameters.AddWithValue("@Monto", entity.Monto);
        cmd.Parameters.AddWithValue("@FacturaId", (object?)entity.FacturaId ?? DBNull.Value);
        var outId = new SqlParameter("@NewId", SqlDbType.Int) { Direction = ParameterDirection.Output };
        cmd.Parameters.Add(outId);
            if (conn is SqlConnection sqlConn) await sqlConn.OpenAsync(ct); else conn.Open();
        await cmd.ExecuteNonQueryAsync(ct);
        return (int)outId.Value;
    }

    public async Task UpdateAsync(int id, NotaCredito entity, CancellationToken ct = default)
    {
        using var conn = _factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_NotasCredito_Update", (SqlConnection)conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@Id", id);
        cmd.Parameters.AddWithValue("@ProveedorId", entity.ProveedorId);
        cmd.Parameters.AddWithValue("@Fecha", entity.Fecha);
        cmd.Parameters.AddWithValue("@Motivo", entity.Motivo);
        cmd.Parameters.AddWithValue("@Monto", entity.Monto);
        cmd.Parameters.AddWithValue("@FacturaId", (object?)entity.FacturaId ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Activo", entity.Activo);
            if (conn is SqlConnection sqlConn) await sqlConn.OpenAsync(ct); else conn.Open();
        await cmd.ExecuteNonQueryAsync(ct);
    }

    private static NotaCredito Map(IDataRecord r) => new()
    {
        Id = r.GetInt32(r.GetOrdinal("Id")),
        ProveedorId = r.GetInt32(r.GetOrdinal("ProveedorId")),
        Fecha = r.GetDateTime(r.GetOrdinal("Fecha")),
        Motivo = r.GetString(r.GetOrdinal("Motivo")),
        Monto = r.GetDecimal(r.GetOrdinal("Monto")),
        FacturaId = r.IsDBNull(r.GetOrdinal("FacturaId")) ? (int?)null : r.GetInt32(r.GetOrdinal("FacturaId")),
        Activo = r.GetBoolean(r.GetOrdinal("Activo"))
    };
}