using Domain.Entities;
using Domain.Interfaces;
using Microsoft.Data.SqlClient;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class TipoRestriccionRepository : ITipoRestriccionRepository
    {
        private readonly string _connectionString;
        public TipoRestriccionRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<IEnumerable<TipoRestriccion>> GetAllAsync()
        {
            var tipos = new List<TipoRestriccion>();
            using (var conn = new SqlConnection(_connectionString))
            {
                string sql = "SELECT Id, Tipo FROM Tipo_Restriccion";
                var cmd = new SqlCommand(sql, conn);
                await conn.OpenAsync();
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        tipos.Add(new TipoRestriccion
                        {
                            Id = reader.GetInt32(0),
                            Tipo = reader.IsDBNull(1) ? null : reader.GetString(1)
                        });
                    }
                }
            }
            return tipos;
        }
    }
}
