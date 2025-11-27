using System.Data;
using Microsoft.Data.SqlClient;
using ProductosService.Common.Abstractions;

namespace ProductosService.Infrastructure.Data;

public sealed class DbConnectionFactory : IDbConnectionFactory
{
    private readonly string _connectionString;
    public DbConnectionFactory(string connectionString) => _connectionString = connectionString;

    public IDbConnection CreateConnection() => new SqlConnection(_connectionString);
}