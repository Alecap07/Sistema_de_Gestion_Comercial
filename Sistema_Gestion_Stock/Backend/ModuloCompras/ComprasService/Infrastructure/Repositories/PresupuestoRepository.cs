using System.Data;
using Microsoft.Data.SqlClient;
using ComprasService.Common.Abstractions;
using ComprasService.Common.Enums;
using ComprasService.Domain.Entities;
using ComprasService.Domain.Interfaces;

namespace ComprasService.Infrastructure.Repositories;

public sealed class PresupuestoRepository : IPresupuestoRepository
{
    private readonly IDbConnectionFactory _factory;
    public PresupuestoRepository(IDbConnectionFactory factory) => _factory = factory;

    public async Task<Presupuesto?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        using var connection = _factory.CreateConnection();
        if (connection is SqlConnection sqlConn)
            await sqlConn.OpenAsync(ct);
        else
            connection.Open();
        using var cmd = new SqlCommand("dbo.sp_Presupuestos_GetById", (SqlConnection)connection) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@Id", id);
        using var r = await cmd.ExecuteReaderAsync(ct);
        if (!await r.ReadAsync(ct)) return null;
        return Map(r);
    }

    public async Task<IEnumerable<Presupuesto>> SearchAsync(int? proveedorId, string? estado, DateTime? fechaDesde, DateTime? fechaHasta, EstadoFiltro estadoFiltro, CancellationToken ct = default)
    {
        using var connection = _factory.CreateConnection();
        if (connection is SqlConnection sqlConn)
            await sqlConn.OpenAsync(ct);
        else
            connection.Open();
        using var cmd = new SqlCommand("dbo.sp_Presupuestos_Search", (SqlConnection)connection) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@ProveedorId", (object?)proveedorId ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Estado", (object?)estado ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@FechaDesde", (object?)fechaDesde ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@FechaHasta", (object?)fechaHasta ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@EstadoFiltro", (byte)estadoFiltro);
        using var r = await cmd.ExecuteReaderAsync(ct);
        var list = new List<Presupuesto>();
        while (await r.ReadAsync(ct))
        {
            list.Add(Map(r));
        }
        return list;
    }

    public async Task<int> CreateAsync(Presupuesto entity, CancellationToken ct = default)
    {
        using var connection = _factory.CreateConnection();
        if (connection is SqlConnection sqlConn)
            await sqlConn.OpenAsync(ct);
        else
            connection.Open();
        using var cmd = new SqlCommand("dbo.sp_Presupuestos_Create", (SqlConnection)connection) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@ProveedorId", entity.ProveedorId);
        cmd.Parameters.AddWithValue("@Fecha", entity.Fecha);
        cmd.Parameters.AddWithValue("@Estado", entity.Estado);
        cmd.Parameters.AddWithValue("@Observacion", (object?)entity.Observacion ?? DBNull.Value);
        var outId = new SqlParameter("@NewId", SqlDbType.Int) { Direction = ParameterDirection.Output };
        cmd.Parameters.Add(outId);
        await cmd.ExecuteNonQueryAsync(ct);
        return (int)outId.Value;
    }

    public async Task UpdateAsync(int id, Presupuesto entity, CancellationToken ct = default)
    {
        using var connection = _factory.CreateConnection();
        if (connection is SqlConnection sqlConn)
            await sqlConn.OpenAsync(ct);
        else
            connection.Open();
        using var cmd = new SqlCommand("dbo.sp_Presupuestos_Update", (SqlConnection)connection) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@Id", id);
        cmd.Parameters.AddWithValue("@ProveedorId", entity.ProveedorId);
        cmd.Parameters.AddWithValue("@Fecha", entity.Fecha);
        cmd.Parameters.AddWithValue("@Estado", entity.Estado);
        cmd.Parameters.AddWithValue("@Observacion", (object?)entity.Observacion ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Activo", entity.Activo);
        await cmd.ExecuteNonQueryAsync(ct);
    }

    private static Presupuesto Map(IDataRecord r) => new()
    {
        Id = r.GetInt32(r.GetOrdinal("Id")),
        ProveedorId = r.GetInt32(r.GetOrdinal("ProveedorId")),
        Fecha = r.GetDateTime(r.GetOrdinal("Fecha")),
        Estado = r.GetString(r.GetOrdinal("Estado")),
        Observacion = r.IsDBNull(r.GetOrdinal("Observacion")) ? null : r.GetString(r.GetOrdinal("Observacion")),
        Activo = r.GetBoolean(r.GetOrdinal("Activo"))
    };
}