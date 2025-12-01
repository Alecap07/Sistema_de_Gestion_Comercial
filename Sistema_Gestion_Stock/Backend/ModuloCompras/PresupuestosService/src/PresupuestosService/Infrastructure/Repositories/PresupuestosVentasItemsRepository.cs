using System.Data;
using Dapper;
using PresupuestosService.Domain.Entities;
using PresupuestosService.Domain.Repositories;
using PresupuestosService.Infrastructure.Data;

namespace PresupuestosService.Infrastructure.Repositories;

public class PresupuestosVentasItemsRepository : IPresupuestosVentasItemsRepository
{
    private readonly ISqlConnectionFactory _factory;

    public PresupuestosVentasItemsRepository(ISqlConnectionFactory factory) => _factory = factory;

    public async Task<int> CreateAsync(PresupuestoVentaItem entity)
    {
        using var conn = _factory.Create();
        conn.Open();
        var p = new DynamicParameters();
        p.Add("@PresupuestoVentaId", entity.PresupuestoVentaId);
        p.Add("@ProductoId", entity.ProductoId);
        p.Add("@Cantidad", entity.Cantidad);
        p.Add("@PrecioUnitario", entity.PrecioUnitario);
        p.Add("@Activo", entity.Activo);
        var id = await conn.ExecuteScalarAsync<int>(StoredProcedureNames.ItemsCreate, p, commandType: CommandType.StoredProcedure);
        return id;
    }

    public async Task<PresupuestoVentaItem?> GetByIdAsync(int id)
    {
        using var conn = _factory.Create();
        conn.Open();
        var p = new DynamicParameters();
        p.Add("@Id", id);
        var item = await conn.QueryFirstOrDefaultAsync<PresupuestoVentaItem>(StoredProcedureNames.ItemsGetById, p, commandType: CommandType.StoredProcedure);
        return item;
    }

    public async Task<IReadOnlyList<PresupuestoVentaItem>> ListByPresupuestoAsync(int presupuestoVentaId)
    {
        using var conn = _factory.Create();
        conn.Open();
        var p = new DynamicParameters();
        p.Add("@PresupuestoVentaId", presupuestoVentaId);
        var items = await conn.QueryAsync<PresupuestoVentaItem>(StoredProcedureNames.ItemsGetByPresupuesto, p, commandType: CommandType.StoredProcedure);
        return items.ToList();
    }

    public async Task<bool> UpdateAsync(PresupuestoVentaItem entity)
    {
        using var conn = _factory.Create();
        conn.Open();
        var p = new DynamicParameters();
        p.Add("@Id", entity.Id);
        p.Add("@PresupuestoVentaId", entity.PresupuestoVentaId);
        p.Add("@ProductoId", entity.ProductoId);
        p.Add("@Cantidad", entity.Cantidad);
        p.Add("@PrecioUnitario", entity.PrecioUnitario);
        p.Add("@Activo", entity.Activo);
        await conn.ExecuteAsync(StoredProcedureNames.ItemsUpdate, p, commandType: CommandType.StoredProcedure);
        return true;
    }

    public async Task<bool> SoftDeleteAsync(int id)
    {
        var existing = await GetByIdAsync(id);
        if (existing is null) return false;
        existing.Activo = false;
        return await UpdateAsync(existing);
    }
}