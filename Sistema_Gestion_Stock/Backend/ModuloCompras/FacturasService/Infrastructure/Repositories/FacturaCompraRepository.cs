// placeholder
using System.Data;
using Microsoft.Data.SqlClient;
using FacturasService.Common.Abstractions;
using FacturasService.Common.Enums;
using FacturasService.Domain.Entities;
using FacturasService.Domain.Interfaces;

namespace FacturasService.Infrastructure.Repositories;

public sealed class FacturaCompraRepository : IFacturaCompraRepository
{
    private readonly IDbConnectionFactory _factory;
    public FacturaCompraRepository(IDbConnectionFactory factory) => _factory = factory;

    public async Task<FacturaCompra?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        using var conn = _factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_FacturasCompra_GetById", (SqlConnection)conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@Id", id);
            if (conn is SqlConnection sqlConn) await sqlConn.OpenAsync(ct); else conn.Open();
        using var r = await cmd.ExecuteReaderAsync(ct);
        if (!await r.ReadAsync(ct)) return null;
        return Map(r);
    }

    public async Task<IEnumerable<FacturaCompra>> SearchAsync(
        int? proveedorId,
        string? numeroFactura,
        DateTime? fechaDesde,
        DateTime? fechaHasta,
        EstadoFiltro estadoFiltro,
        CancellationToken ct = default)
    {
        using var conn = _factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_FacturasCompra_Search", (SqlConnection)conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@ProveedorId", (object?)proveedorId ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@NumeroFactura", (object?)numeroFactura ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@FechaDesde", (object?)fechaDesde ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@FechaHasta", (object?)fechaHasta ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@EstadoFiltro", (byte)estadoFiltro);
            if (conn is SqlConnection sqlConn) await sqlConn.OpenAsync(ct); else conn.Open();
        using var r = await cmd.ExecuteReaderAsync(ct);
        var list = new List<FacturaCompra>();
        while (await r.ReadAsync(ct))
        {
            list.Add(Map(r));
        }
        return list;
    }

    public async Task<int> CreateAsync(FacturaCompra entity, CancellationToken ct = default)
    {
        using var conn = _factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_FacturasCompra_Create", (SqlConnection)conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@ProveedorId", entity.ProveedorId);
        cmd.Parameters.AddWithValue("@NumeroFactura", (object?)entity.NumeroFactura ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Fecha", entity.Fecha);
        cmd.Parameters.AddWithValue("@Total", entity.Total);
        var outId = new SqlParameter("@NewId", SqlDbType.Int) { Direction = ParameterDirection.Output };
        cmd.Parameters.Add(outId);
            if (conn is SqlConnection sqlConn) await sqlConn.OpenAsync(ct); else conn.Open();
        await cmd.ExecuteNonQueryAsync(ct);
        return (int)outId.Value;
    }

    public async Task UpdateAsync(int id, FacturaCompra entity, CancellationToken ct = default)
    {
        using var conn = _factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_FacturasCompra_Update", (SqlConnection)conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@Id", id);
        cmd.Parameters.AddWithValue("@ProveedorId", entity.ProveedorId);
        cmd.Parameters.AddWithValue("@NumeroFactura", (object?)entity.NumeroFactura ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Fecha", entity.Fecha);
        cmd.Parameters.AddWithValue("@Total", entity.Total);
        cmd.Parameters.AddWithValue("@Activo", entity.Activo);
            if (conn is SqlConnection sqlConn) await sqlConn.OpenAsync(ct); else conn.Open();
        await cmd.ExecuteNonQueryAsync(ct);
    }

    private static FacturaCompra Map(IDataRecord r) => new()
    {
        Id = r.GetInt32(r.GetOrdinal("Id")),
        ProveedorId = r.GetInt32(r.GetOrdinal("ProveedorId")),
        NumeroFactura = r.IsDBNull(r.GetOrdinal("NumeroFactura")) ? null : r.GetString(r.GetOrdinal("NumeroFactura")),
        Fecha = r.GetDateTime(r.GetOrdinal("Fecha")),
        Total = r.GetDecimal(r.GetOrdinal("Total")),
        Activo = r.GetBoolean(r.GetOrdinal("Activo"))
    };
}