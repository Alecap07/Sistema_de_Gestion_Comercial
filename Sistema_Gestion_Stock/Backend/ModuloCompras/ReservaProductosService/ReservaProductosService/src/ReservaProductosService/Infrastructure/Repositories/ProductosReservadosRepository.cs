using System.Data;
using System.Data.Common;
using Dapper;
using ReservaProductosService.Domain.Entities;
using ReservaProductosService.Domain.Repositories;
using ReservaProductosService.Infrastructure.Data;

namespace ReservaProductosService.Infrastructure.Repositories;

public class ProductosReservadosRepository : IProductosReservadosRepository
{
    private readonly ISqlConnectionFactory _factory;

    public ProductosReservadosRepository(ISqlConnectionFactory factory) => _factory = factory;

    public async Task<int> CreateAsync(ProductoReservado entity)
    {
        using var conn = _factory.Create();
        await conn.OpenAsync();

        var p = new DynamicParameters();
        p.Add("@NotaPedidoVentaId", entity.NotaPedidoVentaId);
        p.Add("@ProductoId", entity.ProductoId);
        p.Add("@Cantidad", entity.Cantidad);
        p.Add("@FechaReserva", entity.FechaReserva.Date);
        p.Add("@Activo", entity.Activo);

        var newId = await conn.ExecuteScalarAsync<int>(
            StoredProcedureNames.ProductosReservadosCreate,
            p,
            commandType: CommandType.StoredProcedure);

        return newId;
    }

    public async Task<ProductoReservado?> GetByIdAsync(int id)
    {
        using var conn = _factory.Create();
        await conn.OpenAsync();

        var p = new DynamicParameters();
        p.Add("@Id", id);

        var entity = await conn.QueryFirstOrDefaultAsync<ProductoReservado>(
            StoredProcedureNames.ProductosReservadosGetById,
            p,
            commandType: CommandType.StoredProcedure);

        return entity;
    }

    public async Task<IReadOnlyList<ProductoReservado>> ListAsync(bool soloActivos, bool soloInactivos)
    {
        using var conn = _factory.Create();
        await conn.OpenAsync();

        // Call SP without parameters since it doesn't accept them
        var data = await conn.QueryAsync<ProductoReservado>(
            StoredProcedureNames.ProductosReservadosList,
            commandType: CommandType.StoredProcedure);

        // Filter in application layer
        var result = data.ToList();
        
        if (soloActivos)
            return result.Where(x => x.Activo).ToList();
        
        if (soloInactivos)
            return result.Where(x => !x.Activo).ToList();
        
        return result;
    }

    public async Task<bool> UpdateAsync(ProductoReservado entity)
    {
        using var conn = _factory.Create();
        await conn.OpenAsync();

        var p = new DynamicParameters();
        p.Add("@Id", entity.Id);
        p.Add("@NotaPedidoVentaId", entity.NotaPedidoVentaId);
        p.Add("@ProductoId", entity.ProductoId);
        p.Add("@Cantidad", entity.Cantidad);
        p.Add("@FechaReserva", entity.FechaReserva.Date);
        p.Add("@Activo", entity.Activo);

        var rows = await conn.ExecuteAsync(
            StoredProcedureNames.ProductosReservadosUpdate,
            p,
            commandType: CommandType.StoredProcedure);

        return rows != 0;
    }

    public async Task<bool> CancelAsync(int id)
    {
        using var conn = _factory.Create();
        await conn.OpenAsync();

        var p = new DynamicParameters();
        p.Add("@Id", id);

        var rows = await conn.ExecuteAsync(
            StoredProcedureNames.ProductosReservadosCancel,
            p,
            commandType: CommandType.StoredProcedure);

        return rows != 0;
    }
}