using System.Data;
using Microsoft.Data.SqlClient;
using RemitosService.Common.Abstractions;
using RemitosService.Common.Enums;
using RemitosService.Domain.Entities;
using RemitosService.Domain.Interfaces;

namespace RemitosService.Infrastructure.Repositories;

public sealed class RemitoRepository : IRemitoRepository
{
    private readonly IDbConnectionFactory _factory;
    public RemitoRepository(IDbConnectionFactory factory) => _factory = factory;

    public async Task<Remito?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        using var conn = _factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_Remitos_GetById", (SqlConnection)conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@Id", id);
        if (conn is Microsoft.Data.SqlClient.SqlConnection sqlConn)
            await sqlConn.OpenAsync(ct);
        else
            conn.Open();
        using var r = await cmd.ExecuteReaderAsync(ct);
        if (!await r.ReadAsync(ct)) return null;
        return Map(r);
    }

    public async Task<IEnumerable<Remito>> SearchAsync(
        int? proveedorId,
        int? ordenCompraId,
        DateTime? fechaDesde,
        DateTime? fechaHasta,
        EstadoFiltro estadoFiltro,
        CancellationToken ct = default)
    {
        using var conn = _factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_Remitos_Search", (SqlConnection)conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@ProveedorId", (object?)proveedorId ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@OrdenCompraId", (object?)ordenCompraId ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@FechaDesde", (object?)fechaDesde ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@FechaHasta", (object?)fechaHasta ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@EstadoFiltro", (byte)estadoFiltro);
        if (conn is Microsoft.Data.SqlClient.SqlConnection sqlConn)
            await sqlConn.OpenAsync(ct);
        else
            conn.Open();
        using var r = await cmd.ExecuteReaderAsync(ct);
        var list = new List<Remito>();
        while (await r.ReadAsync(ct))
        {
            list.Add(Map(r));
        }
        return list;
    }

    public async Task<int> CreateAsync(Remito entity, CancellationToken ct = default)
    {
        using var conn = _factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_Remitos_Create", (SqlConnection)conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@OrdenCompraId", (object?)entity.OrdenCompraId ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@ProveedorId", entity.ProveedorId);
        cmd.Parameters.AddWithValue("@Fecha", entity.Fecha);
        cmd.Parameters.AddWithValue("@Observacion", (object?)entity.Observacion ?? DBNull.Value);
        var outId = new SqlParameter("@NewId", SqlDbType.Int) { Direction = ParameterDirection.Output };
        cmd.Parameters.Add(outId);
        if (conn is Microsoft.Data.SqlClient.SqlConnection sqlConn)
            await sqlConn.OpenAsync(ct);
        else
            conn.Open();
        await cmd.ExecuteNonQueryAsync(ct);
        return (int)outId.Value;
    }

    public async Task UpdateAsync(int id, Remito entity, CancellationToken ct = default)
    {
        using var conn = _factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_Remitos_Update", (SqlConnection)conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@Id", id);
        cmd.Parameters.AddWithValue("@OrdenCompraId", (object?)entity.OrdenCompraId ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@ProveedorId", entity.ProveedorId);
        cmd.Parameters.AddWithValue("@Fecha", entity.Fecha);
        cmd.Parameters.AddWithValue("@Observacion", (object?)entity.Observacion ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Activo", entity.Activo);
        if (conn is Microsoft.Data.SqlClient.SqlConnection sqlConn)
            await sqlConn.OpenAsync(ct);
        else
            conn.Open();
        await cmd.ExecuteNonQueryAsync(ct);
    }

    private static Remito Map(IDataRecord r) => new()
    {
        Id = r.GetInt32(r.GetOrdinal("Id")),
        OrdenCompraId = r.IsDBNull(r.GetOrdinal("OrdenCompraId")) ? (int?)null : r.GetInt32(r.GetOrdinal("OrdenCompraId")),
        ProveedorId = r.GetInt32(r.GetOrdinal("ProveedorId")),
        Fecha = r.GetDateTime(r.GetOrdinal("Fecha")),
        Observacion = r.IsDBNull(r.GetOrdinal("Observacion")) ? null : r.GetString(r.GetOrdinal("Observacion")),
        Activo = r.GetBoolean(r.GetOrdinal("Activo"))
    };
}