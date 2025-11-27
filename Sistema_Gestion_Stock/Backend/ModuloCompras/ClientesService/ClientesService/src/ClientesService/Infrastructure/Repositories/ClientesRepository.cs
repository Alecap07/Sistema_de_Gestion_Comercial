using System.Data;
using Dapper;
using ClientesService.Domain.Entities;
using ClientesService.Domain.Repositories;
using ClientesService.Infrastructure.Data;

namespace ClientesService.Infrastructure.Repositories;

public class ClientesRepository : IClientesRepository
{
	private readonly ISqlConnectionFactory _connectionFactory;

	public ClientesRepository(ISqlConnectionFactory connectionFactory)
	{
		_connectionFactory = connectionFactory;
	}

	public async Task<int> CreateAsync(Cliente cliente)
	{
		using var conn = _connectionFactory.Create();
		var id = await conn.ExecuteScalarAsync<int>(
			"sp_Clientes_Create",
			new
			{
				cliente.PersonaId,
				Codigo = Truncate(cliente.Codigo, 20),
				cliente.LimiteCredito,
				cliente.Descuento,
				cliente.FormasPago,
				cliente.Observacion,
				cliente.Activo
			},
			commandType: CommandType.StoredProcedure);
		cliente.Id = id;
		return id;
	}

	public async Task<Cliente?> GetByIdAsync(int id)
	{
		using var conn = _connectionFactory.Create();
		return await conn.QueryFirstOrDefaultAsync<Cliente>(
			"sp_Clientes_GetById",
			new { Id = id },
			commandType: CommandType.StoredProcedure);
	}

	public async Task<IReadOnlyList<Cliente>> ListAsync(bool includeInactive)
	{
		using var conn = _connectionFactory.Create();
		var list = await conn.QueryAsync<Cliente>(
			"sp_Clientes_List",
			new { IncludeInactive = includeInactive ? 1 : 0 },
			commandType: CommandType.StoredProcedure);
		return list.ToList();
	}

	public async Task<bool> UpdateAsync(Cliente cliente)
	{
		using var conn = _connectionFactory.Create();
		var rows = await conn.ExecuteAsync(
			"sp_Clientes_Update",
			new
			{
				cliente.Id,
				cliente.PersonaId,
				Codigo = Truncate(cliente.Codigo, 20),
				cliente.LimiteCredito,
				cliente.Descuento,
				cliente.FormasPago,
				cliente.Observacion,
				cliente.Activo
			},
			commandType: CommandType.StoredProcedure);
		return rows > 0;
	}

	public async Task<bool> DeleteAsync(int id)
	{
		using var conn = _connectionFactory.Create();
		var rows = await conn.ExecuteAsync(
			"sp_Clientes_Delete",
			new { Id = id },
			commandType: CommandType.StoredProcedure);
		return rows > 0;
	}

	private static string Truncate(string value, int max)
		=> value.Length <= max ? value : value.Substring(0, max);
}

