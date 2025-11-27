using System.Data;
using Microsoft.Data.SqlClient;
using ProveedoresService.Common.Abstractions;

namespace ProveedoresService.Infrastructure.Data;

public class DbConnectionFactory : IDbConnectionFactory
{
	private readonly string _connectionString;

	public DbConnectionFactory(string connectionString)
	{
		_connectionString = connectionString;
	}

	public IDbConnection CreateConnection()
	{
		return new SqlConnection(_connectionString);
	}
}
