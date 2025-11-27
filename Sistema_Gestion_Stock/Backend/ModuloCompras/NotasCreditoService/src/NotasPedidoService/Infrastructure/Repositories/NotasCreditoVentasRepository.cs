using Dapper;
using System.Data;
using NotasCreditoService.Domain.Entities;
using NotasCreditoService.Domain.IRepositories;
using NotasCreditoService.Infrastructure.Data;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NotasCreditoService.Infrastructure.Repositories
{
    public class NotasCreditoVentasRepository : INotasCreditoVentasRepository
    {
        private readonly DbConnectionFactory _factory;

        public NotasCreditoVentasRepository(DbConnectionFactory factory)
        {
            _factory = factory;
        }

        public async Task<int> CreateAsync(NotaCreditoVenta entity)
        {
            using var conn = _factory.CreateConnection();
            var newId = await conn.QuerySingleAsync<int>(
                "sp_NotasCreditoVentas_Create",
                new
                {
                    ClienteId = entity.ClienteId,
                    Fecha = entity.Fecha,
                    Motivo = entity.Motivo,
                    Monto = entity.Monto,
                    NotaPedidoVentaId = entity.NotaPedidoVentaId,
                    Activo = entity.Activo
                },
                commandType: CommandType.StoredProcedure);
            return newId;
        }

        public async Task<NotaCreditoVenta?> GetByIdAsync(int id)
        {
            using var conn = _factory.CreateConnection();
            var res = await conn.QuerySingleOrDefaultAsync<NotaCreditoVenta>(
                "sp_NotasCreditoVentas_GetById",
                new { Id = id },
                commandType: CommandType.StoredProcedure);
            return res;
        }

        public async Task<IEnumerable<NotaCreditoVenta>> ListAsync()
        {
            using var conn = _factory.CreateConnection();
            var res = await conn.QueryAsync<NotaCreditoVenta>(
                "sp_NotasCreditoVentas_List",
                commandType: CommandType.StoredProcedure);
            return res;
        }

        public async Task UpdateAsync(int id, NotaCreditoVenta entity)
        {
            using var conn = _factory.CreateConnection();
            await conn.ExecuteAsync(
                "sp_NotasCreditoVentas_Update",
                new
                {
                    Id = id,
                    ClienteId = entity.ClienteId,
                    Fecha = entity.Fecha,
                    Motivo = entity.Motivo,
                    Monto = entity.Monto,
                    NotaPedidoVentaId = entity.NotaPedidoVentaId,
                    Activo = entity.Activo
                }, 
                commandType: CommandType.StoredProcedure);
        }

        public async Task CancelAsync(int id)
        {
            using var conn = _factory.CreateConnection();
            await conn.ExecuteAsync(
                "sp_NotasCreditoVentas_Cancel",
                new { Id = id },
                commandType: CommandType.StoredProcedure);
        }
    }
}
