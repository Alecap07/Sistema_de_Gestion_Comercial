using System.Data;
using Microsoft.Data.SqlClient;
using ProveedoresService.Common.Abstractions;
using ProveedoresService.Common.Enums;
using ProveedoresService.Domain.Entities;
using ProveedoresService.Domain.Interfaces;

namespace ProveedoresService.Infrastructure.Repositories;

public sealed class ProveedorDireccionRepository : IProveedorDireccionRepository
{
    private readonly IDbConnectionFactory _factory;
    public ProveedorDireccionRepository(IDbConnectionFactory factory) => _factory = factory;

    public async Task<IEnumerable<ProveedorDireccion>> GetByProveedorAsync(int proveedorId, EstadoFiltro estado, CancellationToken ct = default)
    {
        using var conn = (SqlConnection)_factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_ProveedoresDirecciones_Search", conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@ProveedorId", proveedorId);
        cmd.Parameters.AddWithValue("@Estado", (byte)estado);
        await conn.OpenAsync(ct);
        using var r = await cmd.ExecuteReaderAsync(ct);
        var list = new List<ProveedorDireccion>();
        while (await r.ReadAsync(ct))
        {
            list.Add(Map(r));
        }
        return list;
    }

    public async Task<ProveedorDireccion?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        using var conn = (SqlConnection)_factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_ProveedoresDirecciones_GetById", conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@Id", id);
        await conn.OpenAsync(ct);
        using var r = await cmd.ExecuteReaderAsync(ct);
        if (!await r.ReadAsync(ct)) return null;
        return Map(r);
    }

    public async Task<int> CreateAsync(int proveedorId, ProveedorDireccion entity, CancellationToken ct = default)
    {
        using var conn = (SqlConnection)_factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_ProveedoresDirecciones_Create", conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@ProveedorId", proveedorId);
        cmd.Parameters.AddWithValue("@Calle", entity.Calle);
        cmd.Parameters.AddWithValue("@Altura", (object?)entity.Altura ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Localidad", (object?)entity.Localidad ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Observacion", (object?)entity.Observacion ?? DBNull.Value);
        var outId = new SqlParameter("@NewId", SqlDbType.Int) { Direction = ParameterDirection.Output };
        cmd.Parameters.Add(outId);
        await conn.OpenAsync(ct);
        await cmd.ExecuteNonQueryAsync(ct);
        return (int)outId.Value;
    }

    public async Task UpdateAsync(int id, ProveedorDireccion entity, CancellationToken ct = default)
    {
        using var conn = (SqlConnection)_factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_ProveedoresDirecciones_Update", conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@Id", id);
        cmd.Parameters.AddWithValue("@ProveedorId", entity.ProveedorId);
        cmd.Parameters.AddWithValue("@Calle", entity.Calle);
        cmd.Parameters.AddWithValue("@Altura", (object?)entity.Altura ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Localidad", (object?)entity.Localidad ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Observacion", (object?)entity.Observacion ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Activo", entity.Activo);
        await conn.OpenAsync(ct);
        await cmd.ExecuteNonQueryAsync(ct);
    }

    private static ProveedorDireccion Map(IDataRecord r) => new()
    {
        Id = r.GetInt32(r.GetOrdinal("Id")),
        ProveedorId = r.GetInt32(r.GetOrdinal("ProveedorId")),
        Calle = r.GetString(r.GetOrdinal("Calle")),
        Altura = r.IsDBNull(r.GetOrdinal("Altura")) ? null : r.GetString(r.GetOrdinal("Altura")),
        Localidad = r.IsDBNull(r.GetOrdinal("Localidad")) ? null : r.GetString(r.GetOrdinal("Localidad")),
        Observacion = r.IsDBNull(r.GetOrdinal("Observacion")) ? null : r.GetString(r.GetOrdinal("Observacion")),
        Activo = r.GetBoolean(r.GetOrdinal("Activo"))
    };
}