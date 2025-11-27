using System.Data;
using Microsoft.Data.SqlClient;
using ProductosService.Common.Abstractions;
using ProductosService.Common.Enums;
using ProductosService.Domain.Entities;
using ProductosService.Domain.Interfaces;

namespace ProductosService.Infrastructure.Repositories;

public sealed class CategoriaRepository : ICategoriaRepository
{
    private readonly IDbConnectionFactory _factory;
    public CategoriaRepository(IDbConnectionFactory factory) => _factory = factory;

    public async Task<int> CreateAsync(Categoria e, CancellationToken ct = default)
    {
        using var conn = (SqlConnection)_factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_Categorias_Create", conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@Nombre", e.Nombre);
        var outputId = new SqlParameter("@NewId", SqlDbType.Int) { Direction = ParameterDirection.Output };
        cmd.Parameters.Add(outputId);
        await conn.OpenAsync(ct);
        await cmd.ExecuteNonQueryAsync(ct);
        return (int)outputId.Value;
    }

    public async Task<Categoria?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        using var conn = (SqlConnection)_factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_Categorias_GetById", conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@Id", id);
        await conn.OpenAsync(ct);
        using var reader = await cmd.ExecuteReaderAsync(ct);
        if (!await reader.ReadAsync(ct)) return null;
        return new Categoria
        {
            Id = reader.GetInt32(reader.GetOrdinal("Id")),
            Nombre = reader.GetString(reader.GetOrdinal("Nombre")),
            Activo = reader.GetBoolean(reader.GetOrdinal("Activo"))
        };
    }

    public async Task<IEnumerable<Categoria>> GetAllAsync(EstadoFiltro estado = EstadoFiltro.Activos, CancellationToken ct = default)
    {
        using var conn = (SqlConnection)_factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_Categorias_GetAll", conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.Add(new SqlParameter("@Estado", SqlDbType.TinyInt) { Value = (byte)estado });
        await conn.OpenAsync(ct);
        using var reader = await cmd.ExecuteReaderAsync(ct);
        var list = new List<Categoria>();
        while (await reader.ReadAsync(ct))
        {
            list.Add(new Categoria
            {
                Id = reader.GetInt32(reader.GetOrdinal("Id")),
                Nombre = reader.GetString(reader.GetOrdinal("Nombre")),
                Activo = reader.GetBoolean(reader.GetOrdinal("Activo"))
            });
        }
        return list;
    }

    public async Task UpdateAsync(Categoria e, CancellationToken ct = default)
    {
        using var conn = (SqlConnection)_factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_Categorias_Update", conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@Id", e.Id);
        cmd.Parameters.AddWithValue("@Nombre", e.Nombre);
        cmd.Parameters.AddWithValue("@Activo", e.Activo);
        await conn.OpenAsync(ct);
        await cmd.ExecuteNonQueryAsync(ct);
    }
}