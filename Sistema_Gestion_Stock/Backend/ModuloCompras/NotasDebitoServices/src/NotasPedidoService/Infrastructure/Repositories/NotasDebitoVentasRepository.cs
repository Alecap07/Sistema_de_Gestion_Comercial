using Dapper;
using System.Data;
using NotasDebitoService.Domain.Entities;
using NotasDebitoService.Domain.IRepositories;
using NotasDebitoService.Infrastructure.Data;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NotasDebitoService.Infrastructure.Repositories
{
    public class NotasDebitoVentasRepository : INotasDebitoVentasRepository
    {
        private readonly DbConnectionFactory _factory;

        public NotasDebitoVentasRepository(DbConnectionFactory factory)
        {
            _factory = factory;
        }

        public async Task<int> CreateAsync(NotaDebitoVenta entity)
        {
            using var conn = _factory.CreateConnection();
            var newId = await conn.QuerySingleAsync<int>(
                "sp_NotasDebitoVentas_Create",
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

        public async Task<NotaDebitoVenta?> GetByIdAsync(int id)
        {
            using var conn = _factory.CreateConnection();
            var res = await conn.QuerySingleOrDefaultAsync<NotaDebitoVenta>(
                "sp_NotasDebitoVentas_GetById",
                new { Id = id },
                commandType: CommandType.StoredProcedure);
            return res;
        }

        public async Task<IEnumerable<NotaDebitoVenta>> ListAsync(bool includeInactive)
        {
            using var conn = _factory.CreateConnection();
            var res = await conn.QueryAsync<NotaDebitoVenta>(
                "sp_NotasDebitoVentas_List",
                new { IncludeInactive = includeInactive ? 1 : 0 },
                commandType: CommandType.StoredProcedure);
            return res;
        }

        public async Task UpdateAsync(int id, NotaDebitoVenta entity)
        {
            using var conn = _factory.CreateConnection();
            await conn.ExecuteAsync(
                "sp_NotasDebitoVentas_Update",
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
                "sp_NotasDebitoVentas_Cancel",
                new { Id = id },
                commandType: CommandType.StoredProcedure);
        }
    }
}
