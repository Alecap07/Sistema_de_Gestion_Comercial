using Domain.Entities;
using Domain.Interfaces;
using Microsoft.Data.SqlClient;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class RolRepository : IRolRepository
    {
        private readonly string _connectionString;
        public RolRepository(string connectionString) { _connectionString = connectionString; }
        public async Task<List<Rol>> GetAllAsync(CancellationToken ct)
        {
            var roles = new List<Rol>();
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("SELECT Id, Rol FROM Roles", connection);
            await connection.OpenAsync(ct);
            using var reader = await command.ExecuteReaderAsync(ct);
            while (await reader.ReadAsync(ct))
            {
                roles.Add(new Rol
                {
                    Id = reader.GetInt32(0),
                    Nombre = reader.IsDBNull(1) ? null : reader.GetString(1) // mapear Rol a Nombre
                });
            }
            return roles;
        }
    }

    }
