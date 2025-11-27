using System.Data;
using Microsoft.Data.SqlClient;

namespace ClientesService.Infrastructure.Data;

public interface ISqlConnectionFactory
{
    IDbConnection Create();
}

public class SqlConnectionFactory : ISqlConnectionFactory
{
    private readonly string _connectionString;

    public SqlConnectionFactory(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Falta ConnectionString 'DefaultConnection'.");
    }

    public IDbConnection Create()
    {
        var conn = new SqlConnection(_connectionString);
        return conn;
    }
}