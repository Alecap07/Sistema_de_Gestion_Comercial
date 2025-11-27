using System.Data;
using Microsoft.Data.SqlClient;
using ProveedoresService.Common.Abstractions;
using ProveedoresService.Common.Enums;
using ProveedoresService.Domain.Entities;
using ProveedoresService.Domain.Interfaces;

namespace ProveedoresService.Infrastructure.Repositories;

public sealed class ProveedorCategoriaRepository : IProveedorCategoriaRepository
{
    private readonly IDbConnectionFactory _factory;
    public ProveedorCategoriaRepository(IDbConnectionFactory factory) => _factory = factory;

    public async Task<IEnumerable<ProveedorCategoria>> GetByProveedorAsync(int proveedorId, EstadoFiltro estado, CancellationToken ct = default)
    {
        using var conn = (SqlConnection)_factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_ProveedorCategorias_Search", conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@ProveedorId", proveedorId);
        cmd.Parameters.AddWithValue("@Estado", (byte)estado);
        await conn.OpenAsync(ct);
        using var r = await cmd.ExecuteReaderAsync(ct);
        var list = new List<ProveedorCategoria>();
        while (await r.ReadAsync(ct))
        {
            list.Add(Map(r));
        }
        return list;
    }

    public async Task<ProveedorCategoria?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        using var conn = (SqlConnection)_factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_ProveedorCategorias_GetById", conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@Id", id);
        await conn.OpenAsync(ct);
        using var r = await cmd.ExecuteReaderAsync(ct);
        if (!await r.ReadAsync(ct)) return null;
        return Map(r);
    }

    public async Task<int> CreateAsync(int proveedorId, ProveedorCategoria entity, CancellationToken ct = default)
    {
        using var conn = (SqlConnection)_factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_ProveedorCategorias_Create", conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@ProveedorId", proveedorId);
        cmd.Parameters.AddWithValue("@CategoriaId", entity.CategoriaId);
        var outId = new SqlParameter("@NewId", SqlDbType.Int) { Direction = ParameterDirection.Output };
        cmd.Parameters.Add(outId);
        await conn.OpenAsync(ct);
        await cmd.ExecuteNonQueryAsync(ct);
        return (int)outId.Value;
    }

    public async Task UpdateAsync(int id, ProveedorCategoria entity, CancellationToken ct = default)
    {
        using var conn = (SqlConnection)_factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_ProveedorCategorias_Update", conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@Id", id);
        cmd.Parameters.AddWithValue("@ProveedorId", entity.ProveedorId);
        cmd.Parameters.AddWithValue("@CategoriaId", entity.CategoriaId);
        cmd.Parameters.AddWithValue("@Activo", entity.Activo);
        await conn.OpenAsync(ct);
        await cmd.ExecuteNonQueryAsync(ct);
    }

    private static ProveedorCategoria Map(IDataRecord r) => new()
    {
        Id = r.GetInt32(r.GetOrdinal("Id")),
        ProveedorId = r.GetInt32(r.GetOrdinal("ProveedorId")),
        CategoriaId = r.GetInt32(r.GetOrdinal("CategoriaId")),
        Activo = r.GetBoolean(r.GetOrdinal("Activo"))
    };
}