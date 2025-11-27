using System.Data;
using Microsoft.Data.SqlClient;

namespace PresupuestosService.Infrastructure.Data;

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
            ?? throw new InvalidOperationException("Falta ConnectionStrings:DefaultConnection.");
    }

    public IDbConnection Create() => new SqlConnection(_connectionString);
}