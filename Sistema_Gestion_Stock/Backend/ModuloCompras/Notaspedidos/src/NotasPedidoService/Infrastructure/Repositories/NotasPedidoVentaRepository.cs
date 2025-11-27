using Dapper;
using System.Data;
using NotasPedidoService.Domain.Entities;
using NotasPedidoService.Domain.IRepositories;
using NotasPedidoService.Infrastructure.Data;

namespace NotasPedidoService.Infrastructure.Repositories
{
    public class NotasPedidoVentaRepository : INotasPedidoVentaRepository
    {
        private readonly DbConnectionFactory _factory;

        public NotasPedidoVentaRepository(DbConnectionFactory factory)
        {
            _factory = factory;
        }

        public async Task<int> CreateAsync(NotaPedidoVenta entity)
        {
            using var conn = _factory.CreateConnection();
            var parameters = new
            {
                ClienteId = entity.ClienteId,
                Fecha = entity.Fecha.Date,
                Estado = entity.Estado,
                Observacion = entity.Observacion,
                Activo = entity.Activo
            };
            var newId = await conn.QuerySingleAsync<int>(
                "sp_NotasPedidoVenta_Create",
                parameters,
                commandType: CommandType.StoredProcedure);
            return newId;
        }

        public async Task<NotaPedidoVenta?> GetByIdAsync(int id)
        {
            using var conn = _factory.CreateConnection();
            var result = await conn.QuerySingleOrDefaultAsync<NotaPedidoVenta>(
                "sp_NotasPedidoVenta_GetById",
                new { Id = id },
                commandType: CommandType.StoredProcedure);
            return result;
        }

        public async Task<IEnumerable<NotaPedidoVenta>> ListAsync(bool includeInactive)
        {
            using var conn = _factory.CreateConnection();
            var res = await conn.QueryAsync<NotaPedidoVenta>(
                "sp_NotasPedidoVenta_List",
                new { IncludeInactive = includeInactive ? 1 : 0 },
                commandType: CommandType.StoredProcedure);
            return res;
        }

        public async Task UpdateAsync(int id, NotaPedidoVenta entity)
        {
            using var conn = _factory.CreateConnection();
            await conn.ExecuteAsync(
                "sp_NotasPedidoVenta_Update",
                new
                {
                    Id = id,
                    ClienteId = entity.ClienteId,
                    Fecha = entity.Fecha.Date,
                    Estado = entity.Estado,
                    Observacion = entity.Observacion,
                    Activo = entity.Activo
                }, commandType: CommandType.StoredProcedure);
        }

        public async Task CancelAsync(int id)
        {
            using var conn = _factory.CreateConnection();
            await conn.ExecuteAsync("sp_NotasPedidoVenta_Cancel",
                new { Id = id },
                commandType: CommandType.StoredProcedure);
        }
    }
}
