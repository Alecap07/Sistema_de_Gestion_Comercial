using Domain.Entities;
using Domain.Interfaces;
using Microsoft.Data.SqlClient;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class PermisoRepository : IPermisoRepository
    {
        private readonly string _connectionString;
        public PermisoRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<IEnumerable<Permisos>> GetAllAsync(CancellationToken ct)
        {
            var result = new List<Permisos>();
            using (var conn = new SqlConnection(_connectionString))
            {
                var cmd = new SqlCommand("SELECT Id, Permiso, Descripcion FROM Permisos", conn);
                await conn.OpenAsync(ct);
                using (var reader = await cmd.ExecuteReaderAsync(ct))
                {
                    while (await reader.ReadAsync(ct))
                    {
                        result.Add(new Permisos
                        {
                            Id = reader.GetInt32(0),
                            Permiso = reader.IsDBNull(1) ? null : reader.GetString(1),
                            Descripcion = reader.IsDBNull(2) ? null : reader.GetString(2)
                        });
                    }
                }
            }
            return result;
        }
    }
}
