using System.Data;
using Microsoft.Data.SqlClient;
using ProveedoresService.Common.Abstractions;
using ProveedoresService.Common.Enums;
using ProveedoresService.Domain.Entities;
using ProveedoresService.Domain.Interfaces;

namespace ProveedoresService.Infrastructure.Repositories;

public sealed class ProveedorRepository : IProveedorRepository
{
    private readonly IDbConnectionFactory _factory;
    public ProveedorRepository(IDbConnectionFactory factory) => _factory = factory;

    public async Task<Proveedor?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        using var conn = (SqlConnection)_factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_Proveedores_GetById", conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@Id", id);
        await conn.OpenAsync(ct);
        using var r = await cmd.ExecuteReaderAsync(ct);
        if (!await r.ReadAsync(ct)) return null;
        return Map(r);
    }

    public async Task<Proveedor?> GetByCodigoAsync(string codigo, CancellationToken ct = default)
    {
        using var conn = (SqlConnection)_factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_Proveedores_GetByCodigo", conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@Codigo", codigo);
        await conn.OpenAsync(ct);
        using var r = await cmd.ExecuteReaderAsync(ct);
        if (!await r.ReadAsync(ct)) return null;
        return Map(r);
    }

    public async Task<IEnumerable<Proveedor>> SearchAsync(
        string? razonSocial, string? codigo, int? personaId, EstadoFiltro estado = EstadoFiltro.Activos, CancellationToken ct = default)
    {
        using var conn = (SqlConnection)_factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_Proveedores_Search", conn) { CommandType = CommandType.StoredProcedure };
        if (!string.IsNullOrWhiteSpace(razonSocial)) cmd.Parameters.AddWithValue("@RazonSocial", razonSocial);
        if (!string.IsNullOrWhiteSpace(codigo)) cmd.Parameters.AddWithValue("@Codigo", codigo);
        if (personaId.HasValue) cmd.Parameters.AddWithValue("@PersonaId", personaId.Value);
        cmd.Parameters.AddWithValue("@Estado", (byte)estado);

        await conn.OpenAsync(ct);
        using var r = await cmd.ExecuteReaderAsync(ct);
        var list = new List<Proveedor>();
        while (await r.ReadAsync(ct)) list.Add(Map(r));
        return list;
    }

    public async Task<int> CreateAsync(Proveedor e, CancellationToken ct = default)
    {
        using var conn = (SqlConnection)_factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_Proveedores_Create", conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@PersonaId", e.PersonaId);
        cmd.Parameters.AddWithValue("@Codigo", e.Codigo);
        cmd.Parameters.AddWithValue("@RazonSocial", e.RazonSocial);
        cmd.Parameters.AddWithValue("@FormaPago", (object?)e.FormaPago ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@TiempoEntregaDias", (object?)e.TiempoEntregaDias ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@DescuentosOtorgados", (object?)e.DescuentosOtorgados ?? DBNull.Value);

        var outId = new SqlParameter("@NewId", SqlDbType.Int) { Direction = ParameterDirection.Output };
        cmd.Parameters.Add(outId);

        await conn.OpenAsync(ct);
        await cmd.ExecuteNonQueryAsync(ct);
        return (int)outId.Value;
    }

    public async Task UpdateAsync(Proveedor e, CancellationToken ct = default)
    {
        using var conn = (SqlConnection)_factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_Proveedores_Update", conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@Id", e.Id);
        cmd.Parameters.AddWithValue("@PersonaId", e.PersonaId);
        cmd.Parameters.AddWithValue("@Codigo", e.Codigo);
        cmd.Parameters.AddWithValue("@RazonSocial", e.RazonSocial);
        cmd.Parameters.AddWithValue("@FormaPago", (object?)e.FormaPago ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@TiempoEntregaDias", (object?)e.TiempoEntregaDias ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@DescuentosOtorgados", (object?)e.DescuentosOtorgados ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Activo", e.Activo);

        await conn.OpenAsync(ct);
        await cmd.ExecuteNonQueryAsync(ct);
    }

    private static Proveedor Map(IDataRecord r) => new()
    {
        Id = r.GetInt32(r.GetOrdinal("Id")),
        PersonaId = r.GetInt32(r.GetOrdinal("PersonaId")),
        Codigo = r.GetString(r.GetOrdinal("Codigo")),
        RazonSocial = r.GetString(r.GetOrdinal("RazonSocial")),
        FormaPago = r.IsDBNull(r.GetOrdinal("FormaPago")) ? null : r.GetString(r.GetOrdinal("FormaPago")),
        TiempoEntregaDias = r.IsDBNull(r.GetOrdinal("TiempoEntregaDias")) ? null : r.GetInt32(r.GetOrdinal("TiempoEntregaDias")),
        DescuentosOtorgados = r.IsDBNull(r.GetOrdinal("DescuentosOtorgados")) ? null : r.GetString(r.GetOrdinal("DescuentosOtorgados")),
        Activo = r.GetBoolean(r.GetOrdinal("Activo"))
    };
}