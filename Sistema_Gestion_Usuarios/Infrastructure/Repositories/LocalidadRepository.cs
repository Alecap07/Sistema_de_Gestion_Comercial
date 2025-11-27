using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using System.Threading;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Interfaces;

namespace Infrastructure.Repositories
{
    public class LocalidadRepository : ILocalidadRepository
    {
        private readonly string _connectionString;
        public LocalidadRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<List<Localidad>> GetAllAsync(CancellationToken ct)
        {
            var localidades = new List<Localidad>();
            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync(ct);
            var sql = "SELECT Id, Nom_Local, Id_Parti FROM Localidad";
            using var cmd = new SqlCommand(sql, conn);
            using var reader = await cmd.ExecuteReaderAsync(ct);
            while (await reader.ReadAsync(ct))
            {
                localidades.Add(new Localidad
                {
                    Id = reader.GetInt32(0),
                    Nom_Local = reader.GetString(1),
                    Id_Parti = reader.GetInt32(2)
                });
            }
            return localidades;
        }
    }
}
