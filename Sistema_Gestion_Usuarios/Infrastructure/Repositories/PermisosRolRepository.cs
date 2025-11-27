using Common;
using Domain.Entities;
using Microsoft.Data.SqlClient;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class PermisosRolRepository
    {
        private readonly string _connectionString;
        public PermisosRolRepository(string connectionString)
        {
            _connectionString = connectionString;
        }
        // ...existing code...
        public async Task UpdateAsync(PermisosRolDto dto, CancellationToken ct)
        {
            using var conn = new SqlConnection(_connectionString);
            var cmd = new SqlCommand(@"UPDATE Permisos_Rol SET Id_Rol = @Id_Rol, Id_Permi = @Id_Permi, Nombre = @Nombre WHERE Id_PermisosRol = @Id", conn);
            cmd.Parameters.AddWithValue("@Id_Rol", dto.Id_Rol);
            cmd.Parameters.AddWithValue("@Id_Permi", dto.Id_Permi);
            cmd.Parameters.AddWithValue("@Nombre", (object?)dto.Nombre ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@Id", dto.Id_PermisosRol);
            await conn.OpenAsync(ct);
            await cmd.ExecuteNonQueryAsync(ct);
        }

    // ...existing code...

        public async Task<List<PermisosRolDto>> GetAllJoinAsync(CancellationToken ct)
        {
            var result = new List<PermisosRolDto>();
            using (var conn = new SqlConnection(_connectionString))
            {
                var cmd = new SqlCommand(@"SELECT pr.Id_Rol, pr.Id_Permi, pr.Id_PermisosRol, pr.Nombre,
                                                p.Permiso, r.Rol
                                         FROM Permisos_Rol pr
                                         JOIN Permisos p ON pr.Id_Permi = p.Id
                                         JOIN Roles r ON pr.Id_Rol = r.Id", conn);
                await conn.OpenAsync(ct);
                using (var reader = await cmd.ExecuteReaderAsync(ct))
                {
                    while (await reader.ReadAsync(ct))
                    {
                        result.Add(new PermisosRolDto
                        {
                            Id_Rol = reader.GetInt32(0),
                            Id_Permi = reader.GetInt32(1),
                            Id_PermisosRol = reader.GetInt32(2),
                            Nombre = reader.IsDBNull(3) ? null : reader.GetString(3)
                        
                        });
                    }
                }
            }
            return result;
        }
        public async Task AddAsync(PermisosRolDto dto, CancellationToken ct)
        {
            using var conn = new SqlConnection(_connectionString);
            var cmd = new SqlCommand(@"INSERT INTO Permisos_Rol (Id_Rol, Id_Permi, Nombre) VALUES (@Id_Rol, @Id_Permi, @Nombre)", conn);
            cmd.Parameters.AddWithValue("@Id_Rol", dto.Id_Rol);
            cmd.Parameters.AddWithValue("@Id_Permi", dto.Id_Permi);
            cmd.Parameters.AddWithValue("@Nombre", (object?)dto.Nombre ?? (object)DBNull.Value);
            await conn.OpenAsync(ct);
            await cmd.ExecuteNonQueryAsync(ct);
        }
    }
}
