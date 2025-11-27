using Dapper;
using System.Data;
using DevolucionesService.Domain.Entities;
using DevolucionesService.Domain.IRepositories;
using DevolucionesService.Infrastructure.Data;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DevolucionesService.Infrastructure.Repositories
{
    public class DevolucionesVentaRepository : IDevolucionesVentaRepository
    {
        private readonly DbConnectionFactory _factory;

        public DevolucionesVentaRepository(DbConnectionFactory factory)
        {
            _factory = factory;
        }

        public async Task<int> CreateAsync(DevolucionVenta entity)
        {
            using var conn = _factory.CreateConnection();
            var newId = await conn.QuerySingleAsync<int>(
                "sp_DevolucionesVenta_Create",
                new
                {
                    ClienteId = entity.ClienteId,
                    NotaPedidoVentaId = entity.NotaPedidoVentaId,
                    Fecha = entity.Fecha,
                    Motivo = entity.Motivo,
                    Activo = entity.Activo
                },
                commandType: CommandType.StoredProcedure);
            return newId;
        }

        public async Task<DevolucionVenta?> GetByIdAsync(int id)
        {
            using var conn = _factory.CreateConnection();
            var res = await conn.QuerySingleOrDefaultAsync<DevolucionVenta>(
                "sp_DevolucionesVenta_GetById",
                new { Id = id },
                commandType: CommandType.StoredProcedure);
            return res;
        }

        public async Task<IEnumerable<DevolucionVenta>> ListAsync(bool includeInactive)
        {
            using var conn = _factory.CreateConnection();
            var res = await conn.QueryAsync<DevolucionVenta>(
                "sp_DevolucionesVenta_List",
                new { IncludeInactive = includeInactive ? 1 : 0 },
                commandType: CommandType.StoredProcedure);
            return res;
        }

        public async Task UpdateAsync(int id, DevolucionVenta entity)
        {
            using var conn = _factory.CreateConnection();
            await conn.ExecuteAsync(
                "sp_DevolucionesVenta_Update",
                new
                {
                    Id = id,
                    ClienteId = entity.ClienteId,
                    NotaPedidoVentaId = entity.NotaPedidoVentaId,
                    Fecha = entity.Fecha,
                    Motivo = entity.Motivo,
                    Activo = entity.Activo
                }, commandType: CommandType.StoredProcedure);
        }

        public async Task CancelAsync(int id)
        {
            using var conn = _factory.CreateConnection();
            await conn.ExecuteAsync("sp_DevolucionesVenta_Cancel",
                new { Id = id },
                commandType: CommandType.StoredProcedure);
        }
    }
}
