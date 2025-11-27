using Dapper;
using System.Data;
using NotasPedidoService.Domain.Entities;
using NotasPedidoService.Domain.IRepositories;
using NotasPedidoService.Infrastructure.Data;

namespace NotasPedidoService.Infrastructure.Repositories
{
    public class NotaPedidoVentaItemsRepository : INotaPedidoVentaItemsRepository
    {
        private readonly DbConnectionFactory _factory;

        public NotaPedidoVentaItemsRepository(DbConnectionFactory factory)
        {
            _factory = factory;
        }

        public async Task<int> CreateAsync(NotaPedidoVentaItem entity)
        {
            using var conn = _factory.CreateConnection();
            var newId = await conn.QuerySingleAsync<int>(
                "sp_NotaPedidoVentaItems_Create",
                new
                {
                    NotaPedidoVentaId = entity.NotaPedidoVentaId,
                    ProductoId = entity.ProductoId,
                    Cantidad = entity.Cantidad,
                    PrecioUnitario = entity.PrecioUnitario,
                    Activo = entity.Activo
                },
                commandType: CommandType.StoredProcedure);
            return newId;
        }

        public async Task<NotaPedidoVentaItem?> GetByIdAsync(int id)
        {
            using var conn = _factory.CreateConnection();
            var res = await conn.QuerySingleOrDefaultAsync<NotaPedidoVentaItem>(
                "sp_NotaPedidoVentaItems_GetById",
                new { Id = id },
                commandType: CommandType.StoredProcedure);
            return res;
        }

        public async Task<IEnumerable<NotaPedidoVentaItem>> ListByNotaAsync(int notaPedidoVentaId, bool includeInactive)
        {
            using var conn = _factory.CreateConnection();
            var res = await conn.QueryAsync<NotaPedidoVentaItem>(
                "sp_NotaPedidoVentaItems_ListByNota",
                new { NotaPedidoVentaId = notaPedidoVentaId, IncludeInactive = includeInactive ? 1 : 0 },
                commandType: CommandType.StoredProcedure);
            return res;
        }

        public async Task UpdateAsync(int id, NotaPedidoVentaItem entity)
        {
            using var conn = _factory.CreateConnection();
            await conn.ExecuteAsync(
                "sp_NotaPedidoVentaItems_Update",
                new
                {
                    Id = id,
                    NotaPedidoVentaId = entity.NotaPedidoVentaId,
                    ProductoId = entity.ProductoId,
                    Cantidad = entity.Cantidad,
                    PrecioUnitario = entity.PrecioUnitario,
                    Activo = entity.Activo
                }, commandType: CommandType.StoredProcedure);
        }

        public async Task CancelAsync(int id)
        {
            using var conn = _factory.CreateConnection();
            await conn.ExecuteAsync("sp_NotaPedidoVentaItems_Cancel",
                new { Id = id },
                commandType: CommandType.StoredProcedure);
        }
    }
}
