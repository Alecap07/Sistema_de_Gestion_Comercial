using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using System.Threading;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Interfaces;

namespace Infrastructure.Repositories
{
    public class ProvinciaRepository : IProvinciaRepository
    {
        private readonly string _connectionString;
        public ProvinciaRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<List<Provincia>> GetAllAsync(CancellationToken ct)
        {
            var provincias = new List<Provincia>();
            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync(ct);
            var sql = "SELECT Id, Nom_Pro FROM Provincia";
            using var cmd = new SqlCommand(sql, conn);
            using var reader = await cmd.ExecuteReaderAsync(ct);
            while (await reader.ReadAsync(ct))
            {
                provincias.Add(new Provincia
                {
                    Id = reader.GetInt32(0),
                    Nom_Pro = reader.GetString(1)
                });
            }
            return provincias;
        }
    }
}
