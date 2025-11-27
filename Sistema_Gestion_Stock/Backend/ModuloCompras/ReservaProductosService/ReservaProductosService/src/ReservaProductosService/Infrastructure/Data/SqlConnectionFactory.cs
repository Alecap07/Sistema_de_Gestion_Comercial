using System.Data.Common;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace ReservaProductosService.Infrastructure.Data;

public interface ISqlConnectionFactory
{
	DbConnection Create();
}

public sealed class SqlConnectionFactory : ISqlConnectionFactory
{
	private readonly string _connectionString;

	public SqlConnectionFactory(IConfiguration configuration)
	{
		_connectionString = configuration.GetConnectionString("DefaultConnection")
			?? throw new InvalidOperationException("Connection string 'DefaultConnection' is not configured.");
	}

	public DbConnection Create() => new SqlConnection(_connectionString);
}
