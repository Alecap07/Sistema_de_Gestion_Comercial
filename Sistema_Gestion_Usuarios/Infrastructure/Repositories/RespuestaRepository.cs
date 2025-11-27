using Domain.Entities;
using Domain.Interfaces;
using Microsoft.Data.SqlClient;
using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;
using Domain.Dtos;

namespace Infrastructure.Repositories
{
    public class RespuestaRepository : IRespuestaRepository
    {
        private readonly string _connectionString;

        public RespuestaRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<int> AddRespuestaAsync(Respuesta respuesta)
        {
            using (var conn = new SqlConnection(_connectionString))
            {
                var cmd = new SqlCommand(
                    "INSERT INTO Respuestas (Id_User, Id_Pregun, Respuesta) VALUES (@Id_User, @Id_Pregun, @Respuesta)",
                    conn
                );
                cmd.Parameters.AddWithValue("@Id_User", respuesta.Id_User);
                cmd.Parameters.AddWithValue("@Id_Pregun", respuesta.Id_Pregun);
                cmd.Parameters.AddWithValue("@Respuesta", respuesta.Texto ?? (object)DBNull.Value);

                await conn.OpenAsync();
                return await cmd.ExecuteNonQueryAsync();
            }
        }

        public async Task<int> UpdateRespuestaAsync(Respuesta respuesta)
        {
            using (var conn = new SqlConnection(_connectionString))
            {
                var cmd = new SqlCommand(
                    "UPDATE Respuestas SET Respuesta = @Respuesta WHERE Id_User = @Id_User AND Id_Pregun = @Id_Pregun",
                    conn
                );
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
                var cmd = new SqlCommand(
                    "SELECT Id_User, Id_Pregun, Respuesta FROM Respuestas WHERE Id_User = @Id_User",
                    conn
                );
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
                            Texto = reader.IsDBNull(2) ? null : reader.GetString(2)
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
                var cmd = new SqlCommand(
                    "SELECT Id_User, Id_Pregun, Respuesta FROM Respuestas WHERE Id_User = @Id_User AND Id_Pregun = @Id_Pregun",
                    conn
                );
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
                            Texto = reader.IsDBNull(2) ? null : reader.GetString(2)
                        };
                    }
                }
            }

            return null;
        }

        public async Task<bool> UpdateRespuestasMasivasAsync(IEnumerable<Respuesta> respuestas)
        {
            bool allUpdated = true;
            foreach (var r in respuestas)
            {
                var result = await UpdateRespuestaAsync(r);
                if (result <= 0) allUpdated = false;
            }
            return allUpdated;
        }
        public async Task<IEnumerable<Respuesta>> ObtenerPorUsuarioAsync(int idUser)
        {
            using var conn = new SqlConnection(_connectionString);
            var sql = "SELECT Id_User, Id_Pregun, Respuesta FROM Respuestas WHERE Id_User = @Id";
            return await conn.QueryAsync<Respuesta>(sql, new { Id = idUser });
        }
       public async Task<List<PreguntaRecuperacionDto>> ObtenerPreguntasDelUsuarioAsync(int idUsuario)
     {
            var sql = @"
                SELECT p.Id AS Id_Pregun, p.Pregunta AS Pregunta
                FROM Gestion_Usuarios.dbo.Preguntas AS p
                INNER JOIN Gestion_Usuarios.dbo.Respuestas AS r ON r.Id_Pregun = p.Id
                WHERE r.Id_User = @IdUsuario AND p.Activa = 1
                ORDER BY p.Id;
            ";

            using var conn = new SqlConnection(_connectionString);
            var preguntas = await conn.QueryAsync<PreguntaRecuperacionDto>(sql, new { IdUsuario = idUsuario });

            return preguntas.ToList();
        }

        public async Task<bool> ValidarRespuestasUsuarioAsync(int idUsuario, List<PreguntaRespuestaRecuperacionDto> respuestas)
{
    var sql = @"
        SELECT COUNT(*) 
        FROM Gestion_Usuarios.dbo.Respuestas r
        INNER JOIN Gestion_Usuarios.dbo.Preguntas p ON p.Id = r.Id_Pregun
        WHERE r.Id_User = @IdUsuario
          AND p.Activa = 1
          AND r.Id_Pregun = @Id
          AND LOWER(LTRIM(RTRIM(r.Respuesta))) = LOWER(LTRIM(RTRIM(@Rta)));
    ";

    using var conn = new SqlConnection(_connectionString);

    int correctas = 0;
    foreach (var r in respuestas)
    {
        var count = await conn.ExecuteScalarAsync<int>(sql, new { IdUsuario = idUsuario, Id = r.Id_Pregun, Rta = r.Respuesta });
        if (count == 1) correctas++;
    }

    return correctas == 6; // Todas correctas
}


    }
}
