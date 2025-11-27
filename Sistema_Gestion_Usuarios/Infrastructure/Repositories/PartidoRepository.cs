using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using System.Threading;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Interfaces;

namespace Infrastructure.Repositories
{
    public class PartidoRepository : IPartidoRepository
    {
        private readonly string _connectionString;
        public PartidoRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<List<Partido>> GetAllAsync(CancellationToken ct)
        {
            var partidos = new List<Partido>();
            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync(ct);
            var sql = "SELECT Id, Nom_Partido, Id_Prov FROM Partido";
            using var cmd = new SqlCommand(sql, conn);
            using var reader = await cmd.ExecuteReaderAsync(ct);
            while (await reader.ReadAsync(ct))
            {
                partidos.Add(new Partido
                {
                    Id = reader.GetInt32(0),
                    Nom_Partido = reader.GetString(1),
                    Id_Prov = reader.GetInt32(2)
                });
            }
            return partidos;
        }
    }
}
