using Domain.Entities;
using Domain.Interfaces;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class TokenRecuperacionRepository : ITokenRecuperacionRepository
    {
        private readonly string _connectionString;

        public TokenRecuperacionRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<int> CreateAsync(TokenRecuperacion token)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(@"
                INSERT INTO TokensRecuperacion (IdUsuario, Token, Estado, FechaCreacion, FechaExpiracion)
                VALUES (@IdUsuario, @Token, @Estado, @FechaCreacion, @FechaExpiracion);
                SELECT CAST(SCOPE_IDENTITY() AS INT);
            ", conn);

            cmd.Parameters.AddWithValue("@IdUsuario", token.IdUsuario);
            cmd.Parameters.AddWithValue("@Token", token.Token);
            cmd.Parameters.AddWithValue("@Estado", token.Estado);
            cmd.Parameters.AddWithValue("@FechaCreacion", token.FechaCreacion);
            cmd.Parameters.AddWithValue("@FechaExpiracion", token.FechaExpiracion);

            await conn.OpenAsync();
            return (int)await cmd.ExecuteScalarAsync();
        }

        public async Task<TokenRecuperacion?> GetByTokenAsync(string token)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(@"
                SELECT IdToken, IdUsuario, Token, Estado, FechaCreacion, FechaExpiracion
                FROM TokensRecuperacion WHERE Token = @Token
            ", conn);
            cmd.Parameters.AddWithValue("@Token", token);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new TokenRecuperacion
                {
                    IdToken = reader.GetInt32(0),
                    IdUsuario = reader.GetInt32(1),
                    Token = reader.GetString(2),
                    Estado = reader.GetString(3),
                    FechaCreacion = reader.GetDateTime(4),
                    FechaExpiracion = reader.GetDateTime(5)
                };
            }

            return null;
        }

        public async Task<bool> MarkAsUsedAsync(int idToken)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("UPDATE TokensRecuperacion SET Estado = 'usado' WHERE IdToken = @IdToken", conn);
            cmd.Parameters.AddWithValue("@IdToken", idToken);
            await conn.OpenAsync();
            return await cmd.ExecuteNonQueryAsync() > 0;
        }

        public async Task<bool> UpdateEstadoAsync(int idToken, string estado)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("UPDATE TokensRecuperacion SET Estado = @Estado WHERE IdToken = @IdToken", conn);
            cmd.Parameters.AddWithValue("@IdToken", idToken);
            cmd.Parameters.AddWithValue("@Estado", estado);
            await conn.OpenAsync();
            return await cmd.ExecuteNonQueryAsync() > 0;
        }

        public async Task<IEnumerable<TokenRecuperacion>> GetActiveTokensByUserAsync(int idUsuario)
        {
            var tokens = new List<TokenRecuperacion>();
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(@"
                SELECT IdToken, IdUsuario, Token, Estado, FechaCreacion, FechaExpiracion
                FROM TokensRecuperacion
                WHERE IdUsuario = @IdUsuario AND Estado = 'pendiente' AND FechaExpiracion > SYSDATETIME()
            ", conn);
            cmd.Parameters.AddWithValue("@IdUsuario", idUsuario);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                tokens.Add(new TokenRecuperacion
                {
                    IdToken = reader.GetInt32(0),
                    IdUsuario = reader.GetInt32(1),
                    Token = reader.GetString(2),
                    Estado = reader.GetString(3),
                    FechaCreacion = reader.GetDateTime(4),
                    FechaExpiracion = reader.GetDateTime(5)
                });
            }
            return tokens;
        }
    }
}
