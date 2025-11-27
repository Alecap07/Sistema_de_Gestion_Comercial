using System.Data;
using Microsoft.Data.SqlClient;
using RemitosService.Common.Abstractions;
using RemitosService.Common.Enums;
using RemitosService.Domain.Entities;
using RemitosService.Domain.Interfaces;

namespace RemitosService.Infrastructure.Repositories;

public sealed class DevolucionProveedorRepository : IDevolucionProveedorRepository
{
    private readonly IDbConnectionFactory _factory;
    public DevolucionProveedorRepository(IDbConnectionFactory factory) => _factory = factory;

    public async Task<DevolucionProveedor?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        using var conn = _factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_DevolucionesProveedor_GetById", (SqlConnection)conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@Id", id);
        if (conn is Microsoft.Data.SqlClient.SqlConnection sqlConn)
            await sqlConn.OpenAsync(ct);
        else
            conn.Open();
        using var r = await cmd.ExecuteReaderAsync(ct);
        if (!await r.ReadAsync(ct)) return null;
        return Map(r);
    }

    public async Task<IEnumerable<DevolucionProveedor>> SearchAsync(
        int? proveedorId,
        DateTime? fechaDesde,
        DateTime? fechaHasta,
        EstadoFiltro estadoFiltro,
        CancellationToken ct = default)
    {
        using var conn = _factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_DevolucionesProveedor_Search", (SqlConnection)conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@ProveedorId", (object?)proveedorId ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@FechaDesde", (object?)fechaDesde ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@FechaHasta", (object?)fechaHasta ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@EstadoFiltro", (byte)estadoFiltro);
        if (conn is Microsoft.Data.SqlClient.SqlConnection sqlConn)
            await sqlConn.OpenAsync(ct);
        else
            conn.Open();
        using var r = await cmd.ExecuteReaderAsync(ct);
        var list = new List<DevolucionProveedor>();
        while (await r.ReadAsync(ct))
        {
            list.Add(Map(r));
        }
        return list;
    }

    public async Task<int> CreateAsync(DevolucionProveedor entity, CancellationToken ct = default)
    {
        using var conn = _factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_DevolucionesProveedor_Create", (SqlConnection)conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@ProveedorId", entity.ProveedorId);
        cmd.Parameters.AddWithValue("@Fecha", entity.Fecha);
        cmd.Parameters.AddWithValue("@Motivo", entity.Motivo);
        var outId = new SqlParameter("@NewId", SqlDbType.Int) { Direction = ParameterDirection.Output };
        cmd.Parameters.Add(outId);
        if (conn is Microsoft.Data.SqlClient.SqlConnection sqlConn)
            await sqlConn.OpenAsync(ct);
        else
            conn.Open();
        await cmd.ExecuteNonQueryAsync(ct);
        return (int)outId.Value;
    }

    public async Task UpdateAsync(int id, DevolucionProveedor entity, CancellationToken ct = default)
    {
        using var conn = _factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_DevolucionesProveedor_Update", (SqlConnection)conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@Id", id);
        cmd.Parameters.AddWithValue("@ProveedorId", entity.ProveedorId);
        cmd.Parameters.AddWithValue("@Fecha", entity.Fecha);
        cmd.Parameters.AddWithValue("@Motivo", entity.Motivo);
        cmd.Parameters.AddWithValue("@Activo", entity.Activo);
        if (conn is Microsoft.Data.SqlClient.SqlConnection sqlConn)
            await sqlConn.OpenAsync(ct);
        else
            conn.Open();
        await cmd.ExecuteNonQueryAsync(ct);
    }

    private static DevolucionProveedor Map(IDataRecord r) => new()
    {
        Id = r.GetInt32(r.GetOrdinal("Id")),
        ProveedorId = r.GetInt32(r.GetOrdinal("ProveedorId")),
        Fecha = r.GetDateTime(r.GetOrdinal("Fecha")),
        Motivo = r.GetString(r.GetOrdinal("Motivo")),
        Activo = r.GetBoolean(r.GetOrdinal("Activo"))
    };
}