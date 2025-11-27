using System.Data;
using Microsoft.Data.SqlClient;
using ComprasService.Common.Abstractions;
using ComprasService.Common.Enums;
using ComprasService.Domain.Entities;
using ComprasService.Domain.Interfaces;

namespace ComprasService.Infrastructure.Repositories;

public sealed class OrdenCompraItemRepository : IOrdenCompraItemRepository
{
    private readonly IDbConnectionFactory _factory;
    public OrdenCompraItemRepository(IDbConnectionFactory factory) => _factory = factory;

    public async Task<OrdenCompraItem?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        using var connection = _factory.CreateConnection();
        if (connection is SqlConnection sqlConn)
            await sqlConn.OpenAsync(ct);
        else
            connection.Open();
        using var cmd = new SqlCommand("dbo.sp_OrdenCompraItems_GetById", (SqlConnection)connection) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@Id", id);
        using var r = await cmd.ExecuteReaderAsync(ct);
        if (!await r.ReadAsync(ct)) return null;
        return Map(r);
    }

    public async Task<IEnumerable<OrdenCompraItem>> SearchAsync(int? ordenCompraId, EstadoFiltro estadoFiltro, CancellationToken ct = default)
    {
        using var connection = _factory.CreateConnection();
        if (connection is SqlConnection sqlConn)
            await sqlConn.OpenAsync(ct);
        else
            connection.Open();
        using var cmd = new SqlCommand("dbo.sp_OrdenCompraItems_Search", (SqlConnection)connection) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@OrdenCompraId", (object?)ordenCompraId ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@EstadoFiltro", (byte)estadoFiltro);
        using var r = await cmd.ExecuteReaderAsync(ct);
        var list = new List<OrdenCompraItem>();
        while (await r.ReadAsync(ct))
        {
            list.Add(Map(r));
        }
        return list;
    }

    public async Task<int> CreateAsync(OrdenCompraItem entity, CancellationToken ct = default)
    {
        using var connection = _factory.CreateConnection();
        if (connection is SqlConnection sqlConn)
            await sqlConn.OpenAsync(ct);
        else
            connection.Open();
        using var cmd = new SqlCommand("dbo.sp_OrdenCompraItems_Create", (SqlConnection)connection) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@OrdenCompraId", entity.OrdenCompraId);
        cmd.Parameters.AddWithValue("@ProductoId", entity.ProductoId);
        cmd.Parameters.AddWithValue("@Cantidad", entity.Cantidad);
        cmd.Parameters.AddWithValue("@PrecioUnitario", entity.PrecioUnitario);
        var outId = new SqlParameter("@NewId", SqlDbType.Int) { Direction = ParameterDirection.Output };
        cmd.Parameters.Add(outId);
        await cmd.ExecuteNonQueryAsync(ct);
        return (int)outId.Value;
    }

    public async Task UpdateAsync(int id, OrdenCompraItem entity, CancellationToken ct = default)
    {
        using var connection = _factory.CreateConnection();
        if (connection is SqlConnection sqlConn)
            await sqlConn.OpenAsync(ct);
        else
            connection.Open();
        using var cmd = new SqlCommand("dbo.sp_OrdenCompraItems_Update", (SqlConnection)connection) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@Id", id);
        cmd.Parameters.AddWithValue("@OrdenCompraId", entity.OrdenCompraId);
        cmd.Parameters.AddWithValue("@ProductoId", entity.ProductoId);
        cmd.Parameters.AddWithValue("@Cantidad", entity.Cantidad);
        cmd.Parameters.AddWithValue("@PrecioUnitario", entity.PrecioUnitario);
        cmd.Parameters.AddWithValue("@Activo", entity.Activo);
        await cmd.ExecuteNonQueryAsync(ct);
    }

    private static OrdenCompraItem Map(IDataRecord r) => new()
    {
        Id = r.GetInt32(r.GetOrdinal("Id")),
        OrdenCompraId = r.GetInt32(r.GetOrdinal("OrdenCompraId")),
        ProductoId = r.GetInt32(r.GetOrdinal("ProductoId")),
        Cantidad = r.GetInt32(r.GetOrdinal("Cantidad")),
        PrecioUnitario = r.GetDecimal(r.GetOrdinal("PrecioUnitario")),
        Activo = r.GetBoolean(r.GetOrdinal("Activo"))
    };
}