using Dapper;
using System.Data;
using DevolucionesService.Domain.Entities;
using DevolucionesService.Domain.IRepositories;
using DevolucionesService.Infrastructure.Data;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DevolucionesService.Infrastructure.Repositories
{
    public class DevolucionVentaItemsRepository : IDevolucionVentaItemsRepository
    {
        private readonly DbConnectionFactory _factory;

        public DevolucionVentaItemsRepository(DbConnectionFactory factory)
        {
            _factory = factory;
        }

        public async Task<int> CreateAsync(DevolucionVentaItem entity)
        {
            using var conn = _factory.CreateConnection();
            var newId = await conn.QuerySingleAsync<int>(
                "sp_DevolucionVentaItems_Create",
                new
                {
                    DevolucionVentaId = entity.DevolucionVentaId,
                    ProductoId = entity.ProductoId,
                    Cantidad = entity.Cantidad,
                    Activo = entity.Activo
                },
                commandType: CommandType.StoredProcedure);
            return newId;
        }

        public async Task<DevolucionVentaItem?> GetByIdAsync(int id)
        {
            using var conn = _factory.CreateConnection();
            var res = await conn.QuerySingleOrDefaultAsync<DevolucionVentaItem>(
                "sp_DevolucionVentaItems_GetById",
                new { Id = id },
                commandType: CommandType.StoredProcedure);
            return res;
        }

        public async Task<IEnumerable<DevolucionVentaItem>> ListByDevolucionAsync(int devolucionVentaId, bool includeInactive)
        {
            using var conn = _factory.CreateConnection();
            var res = await conn.QueryAsync<DevolucionVentaItem>(
                "sp_DevolucionVentaItems_ListByDevolucion",
                new { DevolucionVentaId = devolucionVentaId, IncludeInactive = includeInactive ? 1 : 0 },
                commandType: CommandType.StoredProcedure);
            return res;
        }

        public async Task UpdateAsync(int id, DevolucionVentaItem entity)
        {
            using var conn = _factory.CreateConnection();
            await conn.ExecuteAsync(
                "sp_DevolucionVentaItems_Update",
                new
                {
                    Id = id,
                    DevolucionVentaId = entity.DevolucionVentaId,
                    ProductoId = entity.ProductoId,
                    Cantidad = entity.Cantidad,
                    Activo = entity.Activo
                }, commandType: CommandType.StoredProcedure);
        }

        public async Task CancelAsync(int id)
        {
            using var conn = _factory.CreateConnection();
            await conn.ExecuteAsync("sp_DevolucionVentaItems_Cancel",
                new { Id = id },
                commandType: CommandType.StoredProcedure);
        }
    }
}
