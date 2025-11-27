// placeholder
using System.Data;
using Microsoft.Data.SqlClient;
using FacturasService.Common.Abstractions;
using FacturasService.Common.Enums;
using FacturasService.Domain.Entities;
using FacturasService.Domain.Interfaces;

namespace FacturasService.Infrastructure.Repositories;

public sealed class FacturaCompraItemRepository : IFacturaCompraItemRepository
{
    private readonly IDbConnectionFactory _factory;
    public FacturaCompraItemRepository(IDbConnectionFactory factory) => _factory = factory;

    public async Task<FacturaCompraItem?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        using var conn = _factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_FacturaCompraItems_GetById", (SqlConnection)conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@Id", id);
    if (conn is SqlConnection sqlConn) await sqlConn.OpenAsync(ct); else conn.Open();
        using var r = await cmd.ExecuteReaderAsync(ct);
        if (!await r.ReadAsync(ct)) return null;
        return Map(r);
    }

    public async Task<IEnumerable<FacturaCompraItem>> SearchAsync(
        int? facturaId,
        EstadoFiltro estadoFiltro,
        CancellationToken ct = default)
    {
        using var conn = _factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_FacturaCompraItems_Search", (SqlConnection)conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@FacturaId", (object?)facturaId ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@EstadoFiltro", (byte)estadoFiltro);
    if (conn is SqlConnection sqlConn) await sqlConn.OpenAsync(ct); else conn.Open();
        using var r = await cmd.ExecuteReaderAsync(ct);
        var list = new List<FacturaCompraItem>();
        while (await r.ReadAsync(ct))
        {
            list.Add(Map(r));
        }
        return list;
    }

    public async Task<int> CreateAsync(FacturaCompraItem entity, CancellationToken ct = default)
    {
        using var conn = _factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_FacturaCompraItems_Create", (SqlConnection)conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@FacturaId", entity.FacturaId);
        cmd.Parameters.AddWithValue("@ProductoId", entity.ProductoId);
        cmd.Parameters.AddWithValue("@Cantidad", entity.Cantidad);
        cmd.Parameters.AddWithValue("@PrecioUnitario", entity.PrecioUnitario);
        var outId = new SqlParameter("@NewId", SqlDbType.Int) { Direction = ParameterDirection.Output };
        cmd.Parameters.Add(outId);
    if (conn is SqlConnection sqlConn) await sqlConn.OpenAsync(ct); else conn.Open();
        await cmd.ExecuteNonQueryAsync(ct);
        return (int)outId.Value;
    }

    public async Task UpdateAsync(int id, FacturaCompraItem entity, CancellationToken ct = default)
    {
        using var conn = _factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_FacturaCompraItems_Update", (SqlConnection)conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@Id", id);
        cmd.Parameters.AddWithValue("@FacturaId", entity.FacturaId);
        cmd.Parameters.AddWithValue("@ProductoId", entity.ProductoId);
        cmd.Parameters.AddWithValue("@Cantidad", entity.Cantidad);
        cmd.Parameters.AddWithValue("@PrecioUnitario", entity.PrecioUnitario);
        cmd.Parameters.AddWithValue("@Activo", entity.Activo);
    if (conn is SqlConnection sqlConn) await sqlConn.OpenAsync(ct); else conn.Open();
        await cmd.ExecuteNonQueryAsync(ct);
    }

    private static FacturaCompraItem Map(IDataRecord r) => new()
    {
        Id = r.GetInt32(r.GetOrdinal("Id")),
        FacturaId = r.GetInt32(r.GetOrdinal("FacturaId")),
        ProductoId = r.GetInt32(r.GetOrdinal("ProductoId")),
        Cantidad = r.GetInt32(r.GetOrdinal("Cantidad")),
        PrecioUnitario = r.GetDecimal(r.GetOrdinal("PrecioUnitario")),
        Activo = r.GetBoolean(r.GetOrdinal("Activo"))
    };
}