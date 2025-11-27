using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using Domain.Entities;
using Domain.Interfaces;
using Common;
using System;

namespace Infrastructure.Repositories
{
    public class PermisosUserRepository : IPermisosUserRepository
    {
        private readonly string _connectionString;
        public PermisosUserRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<List<PermisosUser>> GetAllAsync(CancellationToken ct)
        {
            var result = new List<PermisosUser>();
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand(@"SELECT Id_User, Id_Permi, Fecha_Vto FROM Permisos_User", connection);
            await connection.OpenAsync(ct);
            using var reader = await command.ExecuteReaderAsync(ct);
            while (await reader.ReadAsync(ct))
            {
                result.Add(new PermisosUser
                {
                    Id_User = reader.GetInt32(0),
                    Id_Permi = reader.GetInt32(1),
                    Fecha_Vto = reader.IsDBNull(2) ? (DateTime?)null : reader.GetDateTime(2)
                });
            }
            return result;
        }

        public async Task AddAsync(PermisosUser entity, CancellationToken ct)
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand(@"INSERT INTO Permisos_User (Id_User, Id_Permi, Fecha_Vto) VALUES (@Id_User, @Id_Permi, @Fecha_Vto)", connection);
            command.Parameters.AddWithValue("@Id_User", entity.Id_User);
            command.Parameters.AddWithValue("@Id_Permi", entity.Id_Permi);
            command.Parameters.AddWithValue("@Fecha_Vto", (object?)entity.Fecha_Vto ?? DBNull.Value);
            await connection.OpenAsync(ct);
            try
            {
                await command.ExecuteNonQueryAsync(ct);
            }
            catch (SqlException ex) when (ex.Number == 2627 || ex.Number == 2601)
            {
                throw new InvalidOperationException("Ya existe un permiso con ese usuario y permiso.");
            }
        }

        public async Task UpdateAsync(PermisosUser entity, CancellationToken ct)
        {
            using var conn = new SqlConnection(_connectionString);
            var cmd = new SqlCommand(@"
        UPDATE Permisos_User
        SET Id_User = @New_Id_User, 
            Id_Permi = @New_Id_Permi, 
            Fecha_Vto = @Fecha_Vto
        WHERE Id_User = @Original_Id_User AND Id_Permi = @Original_Id_Permi", conn);

            // Nuevos valores
            cmd.Parameters.AddWithValue("@New_Id_User", entity.Id_User);
            cmd.Parameters.AddWithValue("@New_Id_Permi", entity.Id_Permi);
            cmd.Parameters.AddWithValue("@Fecha_Vto", entity.Fecha_Vto ?? (object)DBNull.Value);

            // Valores originales para localizar la fila
            cmd.Parameters.AddWithValue("@Original_Id_User", entity.Original_Id_User ?? entity.Id_User);
            cmd.Parameters.AddWithValue("@Original_Id_Permi", entity.Original_Id_Permi ?? entity.Id_Permi);

            await conn.OpenAsync(ct);

            try
            {
                var rowsAffected = await cmd.ExecuteNonQueryAsync(ct);
                if (rowsAffected == 0)
                    throw new InvalidOperationException("No se encontró el permiso para actualizar.");
            }
            catch (SqlException ex) when (ex.Number == 2627 || ex.Number == 2601)
            {
                throw new InvalidOperationException("Ya existe un permiso con ese usuario y permiso.");
            }
        }


    }
}
