// placeholder
using System.Data;
using Microsoft.Data.SqlClient;
using FacturasService.Common.Abstractions;
using FacturasService.Common.Enums;
using FacturasService.Domain.Entities;
using FacturasService.Domain.Interfaces;

namespace FacturasService.Infrastructure.Repositories;

public sealed class FacturaCompraRemitoRepository : IFacturaCompraRemitoRepository
{
    private readonly IDbConnectionFactory _factory;
    public FacturaCompraRemitoRepository(IDbConnectionFactory factory) => _factory = factory;

    public async Task<FacturaCompraRemito?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        using var conn = _factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_FacturaCompraRemitos_GetById", (SqlConnection)conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@Id", id);
            if (conn is SqlConnection sqlConn) await sqlConn.OpenAsync(ct); else conn.Open();
        using var r = await cmd.ExecuteReaderAsync(ct);
        if (!await r.ReadAsync(ct)) return null;
        return Map(r);
    }

    public async Task<IEnumerable<FacturaCompraRemito>> SearchAsync(
        int? facturaId,
        int? remitoId,
        EstadoFiltro estadoFiltro,
        CancellationToken ct = default)
    {
        using var conn = _factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_FacturaCompraRemitos_Search", (SqlConnection)conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@FacturaId", (object?)facturaId ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@RemitoId", (object?)remitoId ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@EstadoFiltro", (byte)estadoFiltro);
            if (conn is SqlConnection sqlConn) await sqlConn.OpenAsync(ct); else conn.Open();
        using var r = await cmd.ExecuteReaderAsync(ct);
        var list = new List<FacturaCompraRemito>();
        while (await r.ReadAsync(ct))
        {
            list.Add(Map(r));
        }
        return list;
    }

    public async Task<int> CreateAsync(FacturaCompraRemito entity, CancellationToken ct = default)
    {
        using var conn = _factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_FacturaCompraRemitos_Create", (SqlConnection)conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@FacturaId", entity.FacturaId);
        cmd.Parameters.AddWithValue("@RemitoId", entity.RemitoId);
        var outId = new SqlParameter("@NewId", SqlDbType.Int) { Direction = ParameterDirection.Output };
        cmd.Parameters.Add(outId);
            if (conn is SqlConnection sqlConn) await sqlConn.OpenAsync(ct); else conn.Open();
        await cmd.ExecuteNonQueryAsync(ct);
        return (int)outId.Value;
    }

    public async Task UpdateAsync(int id, FacturaCompraRemito entity, CancellationToken ct = default)
    {
        using var conn = _factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_FacturaCompraRemitos_Update", (SqlConnection)conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@Id", id);
        cmd.Parameters.AddWithValue("@FacturaId", entity.FacturaId);
        cmd.Parameters.AddWithValue("@RemitoId", entity.RemitoId);
        cmd.Parameters.AddWithValue("@Activo", entity.Activo);
            if (conn is SqlConnection sqlConn) await sqlConn.OpenAsync(ct); else conn.Open();
        await cmd.ExecuteNonQueryAsync(ct);
    }

    private static FacturaCompraRemito Map(IDataRecord r) => new()
    {
        Id = r.GetInt32(r.GetOrdinal("Id")),
        FacturaId = r.GetInt32(r.GetOrdinal("FacturaId")),
        RemitoId = r.GetInt32(r.GetOrdinal("RemitoId")),
        Activo = r.GetBoolean(r.GetOrdinal("Activo"))
    };
}