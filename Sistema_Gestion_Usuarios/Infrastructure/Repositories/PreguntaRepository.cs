using Domain.Entities;
using Domain.Interfaces;
using Microsoft.Data.SqlClient;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Dapper;

namespace Infrastructure.Repositories
{
        public class PreguntaRepository : IPreguntaRepository
        {
            private readonly string _connectionString;
            public PreguntaRepository(string connectionString)
            {
                _connectionString = connectionString;
            }

            public async Task<int> AddRespuestaAsync(Respuesta respuesta)
            {
                using (var conn = new SqlConnection(_connectionString))
                {
                    var cmd = new SqlCommand("INSERT INTO Respuestas (Id_User, Id_Pregun, Respuesta) VALUES (@Id_User, @Id_Pregun, @Respuesta)", conn);
                    cmd.Parameters.AddWithValue("@Id_User", respuesta.Id_User);
                    cmd.Parameters.AddWithValue("@Id_Pregun", respuesta.Id_Pregun);
                    cmd.Parameters.AddWithValue("@Respuesta", respuesta.Texto ?? (object)DBNull.Value);
                    await conn.OpenAsync();
                    return await cmd.ExecuteNonQueryAsync();
                }
            }

            public async Task<List<Respuesta>> GetRespuestasByUserAsync(int idUser)
{
    var respuestas = new List<Respuesta>();
    using (var conn = new SqlConnection(_connectionString))
    {
        var cmd = new SqlCommand("SELECT Id_User, Id_Pregun, Respuesta FROM Respuestas WHERE Id_User = @Id_User", conn);
        cmd.Parameters.AddWithValue("@Id_User", idUser);
        await conn.OpenAsync();
        using (var reader = await cmd.ExecuteReaderAsync())
        {
            while (await reader.ReadAsync())
            {
                respuestas.Add(new Respuesta
                {
                    Id_User = reader.GetInt32(0),
                    Id_Pregun = reader.GetInt32(1),
                    Texto = reader.IsDBNull(2) ? null : reader.GetString(2) // ✅ aquí
                });
            }
        }
    }
    return respuestas;
}

public async Task<Respuesta?> GetRespuestaAsync(int idUser, int idPregun)
{
    using (var conn = new SqlConnection(_connectionString))
    {
        var cmd = new SqlCommand("SELECT Id_User, Id_Pregun, Respuesta FROM Respuestas WHERE Id_User = @Id_User AND Id_Pregun = @Id_Pregun", conn);
        cmd.Parameters.AddWithValue("@Id_User", idUser);
        cmd.Parameters.AddWithValue("@Id_Pregun", idPregun);
        await conn.OpenAsync();
        using (var reader = await cmd.ExecuteReaderAsync())
        {
            if (await reader.ReadAsync())
            {
                return new Respuesta
                {
                    Id_User = reader.GetInt32(0),
                    Id_Pregun = reader.GetInt32(1),
                    Texto = reader.IsDBNull(2) ? null : reader.GetString(2) // ✅ aquí también
                };
            }
        }
    }
    return null;
}


            public async Task<List<Preguntas>> GetAllAsync(string? busqueda = null)
            {
                var preguntas = new List<Preguntas>();
                using (var conn = new SqlConnection(_connectionString))
                {
                    string sql = "SELECT Id, Pregunta, Activa FROM Preguntas";
                    if (!string.IsNullOrWhiteSpace(busqueda))
                        sql += " WHERE LOWER(Pregunta) COLLATE Latin1_General_CI_AI LIKE @busqueda";
                    var cmd = new SqlCommand(sql, conn);
                    if (!string.IsNullOrWhiteSpace(busqueda))
                        cmd.Parameters.AddWithValue("@busqueda", "%" + busqueda.ToLower() + "%");
                    await conn.OpenAsync();
                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            preguntas.Add(new Preguntas
                            {
                                Id = reader.GetInt32(0),
                                Texto = reader.GetString(1),
                                Activa = reader.GetBoolean(2)
                            });
                        }
                    }
                }
                return preguntas;
            }

            public async Task<Preguntas?> GetByIdAsync(int id)
            {
                using (var conn = new SqlConnection(_connectionString))
                {
                    var cmd = new SqlCommand("SELECT Id, Pregunta, Activa FROM Preguntas WHERE Id = @Id", conn);
                    cmd.Parameters.AddWithValue("@Id", id);
                    await conn.OpenAsync();
                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return new Preguntas
                            {
                                Id = reader.GetInt32(0),
                                Texto = reader.GetString(1),
                                Activa = reader.GetBoolean(2)
                            };
                        }
                    }
                }
                return null;
            }

            public async Task<int> AddAsync(Preguntas pregunta)
            {
                using (var conn = new SqlConnection(_connectionString))
                {
                    var cmd = new SqlCommand("INSERT INTO Preguntas (Pregunta, Activa) VALUES (@Pregunta, @Activa); SELECT SCOPE_IDENTITY();", conn);
                    cmd.Parameters.AddWithValue("@Pregunta", pregunta.Texto);
                    cmd.Parameters.AddWithValue("@Activa", pregunta.Activa);
                    await conn.OpenAsync();
                    var result = await cmd.ExecuteScalarAsync();
                    if (result != null && int.TryParse(result.ToString(), out int id))
                        return id;
                    return -1;
                }
            }

        public async Task<int> UpdateAsync(Preguntas pregunta)
        {
            using (var conn = new SqlConnection(_connectionString))
            {
                var cmd = new SqlCommand("UPDATE Preguntas SET Pregunta = @Pregunta, Activa = @Activa WHERE Id = @Id", conn);
                cmd.Parameters.AddWithValue("@Id", pregunta.Id);
                cmd.Parameters.AddWithValue("@Pregunta", pregunta.Texto);
                cmd.Parameters.AddWithValue("@Activa", pregunta.Activa);
                await conn.OpenAsync();
                return await cmd.ExecuteNonQueryAsync();
            }
        }
        public async Task<IEnumerable<Preguntas>> ObtenerPorIdsAsync(IEnumerable<int> ids)
        {
            using var conn = new SqlConnection(_connectionString);
            var sql = "SELECT Id AS Id_Pregun, Pregunta, Activa FROM Preguntas WHERE Id IN @Ids";
            return await conn.QueryAsync<Preguntas>(sql, new { Ids = ids });
        }

        }
}