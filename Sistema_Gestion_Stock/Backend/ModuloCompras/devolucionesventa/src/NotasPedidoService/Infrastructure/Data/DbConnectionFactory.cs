using Microsoft.Data.SqlClient;
using System.Data;

namespace DevolucionesService.Infrastructure.Data
{
    public class DbConnectionFactory
    {
        private readonly IConfiguration _config;
        private readonly string _connString;

        public DbConnectionFactory(IConfiguration config)
        {
            _config = config;
            _connString = _config.GetConnectionString("DefaultConnection")
                          ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        public IDbConnection CreateConnection()
        {
            return new SqlConnection(_connString);
        }
    }
}
