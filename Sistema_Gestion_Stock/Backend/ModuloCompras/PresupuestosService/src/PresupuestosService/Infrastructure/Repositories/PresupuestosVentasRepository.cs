using System.Data;
using Dapper;
using PresupuestosService.Domain.Entities;
using PresupuestosService.Domain.Repositories;
using PresupuestosService.Infrastructure.Data;

namespace PresupuestosService.Infrastructure.Repositories;

public class PresupuestosVentasRepository : IPresupuestosVentasRepository
{
    private readonly ISqlConnectionFactory _factory;

    public PresupuestosVentasRepository(ISqlConnectionFactory factory) => _factory = factory;

    public async Task<int> CreateAsync(PresupuestoVenta entity)
    {
        using var conn = _factory.Create();
        conn.Open();
        var p = new DynamicParameters();
        p.Add("@ClienteId", entity.ClienteId);
        p.Add("@Fecha", entity.Fecha.Date);
        p.Add("@Estado", entity.Estado);
        p.Add("@Observacion", entity.Observacion);
        p.Add("@Activo", entity.Activo);
        var id = await conn.ExecuteScalarAsync<int>(StoredProcedureNames.PresupuestosCreate, p, commandType: CommandType.StoredProcedure);
        return id;
    }

    public async Task<PresupuestoVenta?> GetByIdAsync(int id)
    {
        using var conn = _factory.Create();
        conn.Open();
        var p = new DynamicParameters();
        p.Add("@Id", id);
        var entity = await conn.QueryFirstOrDefaultAsync<PresupuestoVenta>(StoredProcedureNames.PresupuestosGetById, p, commandType: CommandType.StoredProcedure);
        return entity;
    }

    public async Task<IReadOnlyList<PresupuestoVenta>> ListAllAsync(bool includeInactive)
    {
        using var conn = _factory.Create();
        conn.Open();

        string sql = includeInactive
            ? @"SELECT Id, ClienteId, Fecha, Estado, Observacion, Activo FROM dbo.PresupuestosVentas ORDER BY Id DESC"
            : @"SELECT Id, ClienteId, Fecha, Estado, Observacion, Activo FROM dbo.PresupuestosVentas WHERE Activo = 1 ORDER BY Id DESC";

        var data = await conn.QueryAsync<PresupuestoVenta>(sql);
        return data.ToList();
    }

    public async Task<bool> UpdateAsync(PresupuestoVenta entity)
    {
        using var conn = _factory.Create();
        conn.Open();
        var p = new DynamicParameters();
        p.Add("@Id", entity.Id);
        p.Add("@ClienteId", entity.ClienteId);
        p.Add("@Fecha", entity.Fecha.Date);
        p.Add("@Estado", entity.Estado);
        p.Add("@Observacion", entity.Observacion);
        p.Add("@Activo", entity.Activo);
        await conn.ExecuteAsync(StoredProcedureNames.PresupuestosUpdate, p, commandType: CommandType.StoredProcedure);
        return true;
    }

    public async Task<bool> SoftDeleteAsync(int id)
    {
        using var conn = _factory.Create();
        conn.Open();
        var p = new DynamicParameters();
        p.Add("@Id", id);
        await conn.ExecuteAsync(StoredProcedureNames.PresupuestosDelete, p, commandType: CommandType.StoredProcedure);
        return true;
    }
}