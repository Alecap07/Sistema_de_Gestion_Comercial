using System.Data;
using Microsoft.Data.SqlClient;
using ProveedoresService.Common.Abstractions;
using ProveedoresService.Common.Enums;
using ProveedoresService.Domain.Entities;
using ProveedoresService.Domain.Interfaces;

namespace ProveedoresService.Infrastructure.Repositories;

public sealed class CategoriaRepository : ICategoriaRepository
{
    private readonly IDbConnectionFactory _factory;
    public CategoriaRepository(IDbConnectionFactory factory) => _factory = factory;

    public async Task<Categoria?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        using var conn = (SqlConnection)_factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_Categorias_GetById", conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@Id", id);
        await conn.OpenAsync(ct);
        using var r = await cmd.ExecuteReaderAsync(ct);
        if (!await r.ReadAsync(ct)) return null;
        return Map(r);
    }

    public async Task<IEnumerable<Categoria>> SearchAsync(string? nombre, EstadoFiltro estado, CancellationToken ct = default)
    {
        using var conn = (SqlConnection)_factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_Categorias_Search", conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@Nombre", (object?)nombre ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Estado", (byte)estado);
        await conn.OpenAsync(ct);
        using var r = await cmd.ExecuteReaderAsync(ct);
        var list = new List<Categoria>();
        while (await r.ReadAsync(ct))
        {
            list.Add(Map(r));
        }
        return list;
    }

    public async Task<int> CreateAsync(Categoria entity, CancellationToken ct = default)
    {
        using var conn = (SqlConnection)_factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_Categorias_Create", conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@Nombre", entity.Nombre);
        cmd.Parameters.AddWithValue("@Descripcion", (object?)entity.Descripcion ?? DBNull.Value);
        var outId = new SqlParameter("@NewId", SqlDbType.Int) { Direction = ParameterDirection.Output };
        cmd.Parameters.Add(outId);
        await conn.OpenAsync(ct);
        await cmd.ExecuteNonQueryAsync(ct);
        return (int)outId.Value;
    }

    public async Task UpdateAsync(int id, Categoria entity, CancellationToken ct = default)
    {
        using var conn = (SqlConnection)_factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_Categorias_Update", conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@Id", id);
        cmd.Parameters.AddWithValue("@Nombre", entity.Nombre);
        cmd.Parameters.AddWithValue("@Descripcion", (object?)entity.Descripcion ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Activo", entity.Activo);
        await conn.OpenAsync(ct);
        await cmd.ExecuteNonQueryAsync(ct);
    }

    private static Categoria Map(IDataRecord r) => new()
    {
        Id = r.GetInt32(r.GetOrdinal("Id")),
        Nombre = r.GetString(r.GetOrdinal("Nombre")),
        Descripcion = r.IsDBNull(r.GetOrdinal("Descripcion")) ? null : r.GetString(r.GetOrdinal("Descripcion")),
        Activo = r.GetBoolean(r.GetOrdinal("Activo"))
    };
}