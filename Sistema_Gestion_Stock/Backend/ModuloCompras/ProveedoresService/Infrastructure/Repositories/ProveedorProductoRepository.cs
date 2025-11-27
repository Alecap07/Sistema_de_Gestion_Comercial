using System.Data;
using Microsoft.Data.SqlClient;
using ProveedoresService.Common.Abstractions;
using ProveedoresService.Common.Enums;
using ProveedoresService.Domain.Entities;
using ProveedoresService.Domain.Interfaces;

namespace ProveedoresService.Infrastructure.Repositories;

public sealed class ProveedorProductoRepository : IProveedorProductoRepository
{
    private readonly IDbConnectionFactory _factory;
    public ProveedorProductoRepository(IDbConnectionFactory factory) => _factory = factory;

    public async Task<IEnumerable<ProveedorProducto>> GetByProveedorAsync(int proveedorId, EstadoFiltro estado, CancellationToken ct = default)
    {
        using var conn = (SqlConnection)_factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_ProveedorProductos_Search", conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@ProveedorId", proveedorId);
        cmd.Parameters.AddWithValue("@Estado", (byte)estado);
        await conn.OpenAsync(ct);
        using var r = await cmd.ExecuteReaderAsync(ct);
        var list = new List<ProveedorProducto>();
        while (await r.ReadAsync(ct))
        {
            list.Add(Map(r));
        }
        return list;
    }

    public async Task<ProveedorProducto?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        using var conn = (SqlConnection)_factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_ProveedorProductos_GetById", conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@Id", id);
        await conn.OpenAsync(ct);
        using var r = await cmd.ExecuteReaderAsync(ct);
        if (!await r.ReadAsync(ct)) return null;
        return Map(r);
    }

    public async Task<int> CreateAsync(int proveedorId, ProveedorProducto entity, CancellationToken ct = default)
    {
        using var conn = (SqlConnection)_factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_ProveedorProductos_Create", conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@ProveedorId", proveedorId);
        cmd.Parameters.AddWithValue("@ProductoId", entity.ProductoId);
        cmd.Parameters.AddWithValue("@PrecioCompra", entity.PrecioCompra);
        cmd.Parameters.AddWithValue("@CatalogoUrl", (object?)entity.CatalogoUrl ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@FechaDesde", (object?)entity.FechaDesde ?? DBNull.Value);
        var outId = new SqlParameter("@NewId", SqlDbType.Int) { Direction = ParameterDirection.Output };
        cmd.Parameters.Add(outId);
        await conn.OpenAsync(ct);
        await cmd.ExecuteNonQueryAsync(ct);
        return (int)outId.Value;
    }

    public async Task UpdateAsync(int id, ProveedorProducto entity, CancellationToken ct = default)
    {
        using var conn = (SqlConnection)_factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_ProveedorProductos_Update", conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@Id", id);
        cmd.Parameters.AddWithValue("@ProveedorId", entity.ProveedorId);
        cmd.Parameters.AddWithValue("@ProductoId", entity.ProductoId);
        cmd.Parameters.AddWithValue("@PrecioCompra", entity.PrecioCompra);
        cmd.Parameters.AddWithValue("@CatalogoUrl", (object?)entity.CatalogoUrl ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@FechaDesde", (object?)entity.FechaDesde ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Activo", entity.Activo);
        await conn.OpenAsync(ct);
        await cmd.ExecuteNonQueryAsync(ct);
    }

    private static ProveedorProducto Map(IDataRecord r) => new()
    {
        Id = r.GetInt32(r.GetOrdinal("Id")),
        ProveedorId = r.GetInt32(r.GetOrdinal("ProveedorId")),
        ProductoId = r.GetInt32(r.GetOrdinal("ProductoId")),
        PrecioCompra = r.GetDecimal(r.GetOrdinal("PrecioCompra")),
        CatalogoUrl = r.IsDBNull(r.GetOrdinal("CatalogoUrl")) ? null : r.GetString(r.GetOrdinal("CatalogoUrl")),
        FechaDesde = r.IsDBNull(r.GetOrdinal("FechaDesde")) ? (DateTime?)null : r.GetDateTime(r.GetOrdinal("FechaDesde")),
        Activo = r.GetBoolean(r.GetOrdinal("Activo"))
    };
}