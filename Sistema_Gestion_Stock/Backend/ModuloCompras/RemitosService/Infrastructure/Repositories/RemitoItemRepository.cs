using System.Data;
using Microsoft.Data.SqlClient;
using RemitosService.Common.Abstractions;
using RemitosService.Common.Enums;
using RemitosService.Domain.Entities;
using RemitosService.Domain.Interfaces;

namespace RemitosService.Infrastructure.Repositories;

public sealed class RemitoItemRepository : IRemitoItemRepository
{
    private readonly IDbConnectionFactory _factory;
    public RemitoItemRepository(IDbConnectionFactory factory) => _factory = factory;

        public async Task<RemitoItem?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        using var conn = _factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_RemitoItems_GetById", (SqlConnection)conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@Id", id);
            if (conn is Microsoft.Data.SqlClient.SqlConnection sqlConn)
                await sqlConn.OpenAsync(ct);
            else
                conn.Open();
        using var r = await cmd.ExecuteReaderAsync(ct);
        if (!await r.ReadAsync(ct)) return null;
        return Map(r);
    }

    public async Task<IEnumerable<RemitoItem>> SearchAsync(
        int? remitoId,
        EstadoFiltro estadoFiltro,
        CancellationToken ct = default)
    {
        using var conn = _factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_RemitoItems_Search", (SqlConnection)conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@RemitoId", (object?)remitoId ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@EstadoFiltro", (byte)estadoFiltro);
        if (conn is Microsoft.Data.SqlClient.SqlConnection sqlConn)
            await sqlConn.OpenAsync(ct);
        else
            conn.Open();
        using var r = await cmd.ExecuteReaderAsync(ct);
        var list = new List<RemitoItem>();
        while (await r.ReadAsync(ct))
        {
            list.Add(Map(r));
        }
        return list;
    }

    public async Task<int> CreateAsync(RemitoItem entity, CancellationToken ct = default)
    {
        using var conn = _factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_RemitoItems_Create", (SqlConnection)conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@RemitoId", entity.RemitoId);
        cmd.Parameters.AddWithValue("@ProductoId", entity.ProductoId);
        cmd.Parameters.AddWithValue("@Cantidad", entity.Cantidad);
        var outId = new SqlParameter("@NewId", SqlDbType.Int) { Direction = ParameterDirection.Output };
        cmd.Parameters.Add(outId);
        if (conn is Microsoft.Data.SqlClient.SqlConnection sqlConn)
            await sqlConn.OpenAsync(ct);
        else
            conn.Open();
        await cmd.ExecuteNonQueryAsync(ct);
        return (int)outId.Value;
    }

    public async Task UpdateAsync(int id, RemitoItem entity, CancellationToken ct = default)
    {
        using var conn = _factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_RemitoItems_Update", (SqlConnection)conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@Id", id);
        cmd.Parameters.AddWithValue("@RemitoId", entity.RemitoId);
        cmd.Parameters.AddWithValue("@ProductoId", entity.ProductoId);
        cmd.Parameters.AddWithValue("@Cantidad", entity.Cantidad);
        cmd.Parameters.AddWithValue("@Activo", entity.Activo);
        if (conn is Microsoft.Data.SqlClient.SqlConnection sqlConn)
            await sqlConn.OpenAsync(ct);
        else
            conn.Open();
        await cmd.ExecuteNonQueryAsync(ct);
    }

    private static RemitoItem Map(IDataRecord r) => new()
    {
        Id = r.GetInt32(r.GetOrdinal("Id")),
        RemitoId = r.GetInt32(r.GetOrdinal("RemitoId")),
        ProductoId = r.GetInt32(r.GetOrdinal("ProductoId")),
        Cantidad = r.GetInt32(r.GetOrdinal("Cantidad")),
        Activo = r.GetBoolean(r.GetOrdinal("Activo"))
    };
}