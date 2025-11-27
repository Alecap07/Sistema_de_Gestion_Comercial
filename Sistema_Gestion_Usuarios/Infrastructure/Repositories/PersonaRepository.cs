using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using Domain.Entities;
using Domain.Interfaces;
using Common;

namespace Infrastructure.Repositories
{
    public class PersonaRepository : IPersonaRepository
    {
        private readonly string _connectionString;
        public PersonaRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<List<Persona>> GetAllAsync(CancellationToken ct)
        {
            var personas = new List<Persona>();
            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync(ct);

            var sql = @"
                SELECT 
                    p.Id,
                    p.Legajo,
                    p.Nombre AS PersonaNombre,
                    p.Apellido,
                    p.Tipo_Doc,
                    p.Num_Doc,
                    p.Cuil,
                    p.Calle,
                    p.Altura,
                    p.Cod_Post,
                    p.Id_Provi,
                    p.Id_Partido,
                    p.Id_Local,
                    p.Genero,
                    p.Telefono,
                    p.Email_Personal,
                    pr.Nom_Pro AS ProvinciaNombre,
                    pa.Nom_Partido AS PartidoNombre,
                    l.Nom_Local AS LocalidadNombre
                FROM Persona p
                LEFT JOIN Provincia pr ON p.Id_Provi = pr.Id
                LEFT JOIN Partido pa ON p.Id_Partido = pa.Id
                LEFT JOIN Localidad l ON p.Id_Local = l.Id
            ";

            using var cmd = new SqlCommand(sql, conn);
            using var reader = await cmd.ExecuteReaderAsync(ct);
            while (await reader.ReadAsync(ct))
            {
                var persona = new Persona
                {
                    Id = reader.GetInt32(reader.GetOrdinal("Id")),
                    Legajo = reader.GetInt32(reader.GetOrdinal("Legajo")),
                    Nombre = reader.IsDBNull(reader.GetOrdinal("PersonaNombre")) ? null : reader.GetString(reader.GetOrdinal("PersonaNombre")),
                    Apellido = reader.IsDBNull(reader.GetOrdinal("Apellido")) ? null : reader.GetString(reader.GetOrdinal("Apellido")),
                    Tipo_Doc = reader.IsDBNull(reader.GetOrdinal("Tipo_Doc")) ? null : reader.GetString(reader.GetOrdinal("Tipo_Doc")),
                    Num_Doc = reader.IsDBNull(reader.GetOrdinal("Num_Doc")) ? null : reader.GetString(reader.GetOrdinal("Num_Doc")),
                    Cuil = reader.IsDBNull(reader.GetOrdinal("Cuil")) ? null : reader.GetString(reader.GetOrdinal("Cuil")),
                    Calle = reader.IsDBNull(reader.GetOrdinal("Calle")) ? null : reader.GetString(reader.GetOrdinal("Calle")),
                    Altura = reader.IsDBNull(reader.GetOrdinal("Altura")) ? null : reader.GetString(reader.GetOrdinal("Altura")),
                    Cod_Post = reader.IsDBNull(reader.GetOrdinal("Cod_Post")) ? 0 : reader.GetInt32(reader.GetOrdinal("Cod_Post")),
                    Id_Provi = reader.IsDBNull(reader.GetOrdinal("Id_Provi")) ? 0 : reader.GetInt32(reader.GetOrdinal("Id_Provi")),
                    Id_Partido = reader.IsDBNull(reader.GetOrdinal("Id_Partido")) ? 0 : reader.GetInt32(reader.GetOrdinal("Id_Partido")),
                    Id_Local = reader.IsDBNull(reader.GetOrdinal("Id_Local")) ? 0 : reader.GetInt32(reader.GetOrdinal("Id_Local")),
                    Genero = reader.IsDBNull(reader.GetOrdinal("Genero")) ? 0 : reader.GetInt32(reader.GetOrdinal("Genero")),
                    Telefono = reader.IsDBNull(reader.GetOrdinal("Telefono")) ? null : reader.GetString(reader.GetOrdinal("Telefono")),
                    Email_Personal = reader.IsDBNull(reader.GetOrdinal("Email_Personal")) ? null : reader.GetString(reader.GetOrdinal("Email_Personal")),
                    ProvinciaNombre = reader.IsDBNull(reader.GetOrdinal("ProvinciaNombre")) ? null : reader.GetString(reader.GetOrdinal("ProvinciaNombre")),
                    PartidoNombre = reader.IsDBNull(reader.GetOrdinal("PartidoNombre")) ? null : reader.GetString(reader.GetOrdinal("PartidoNombre")),
                    LocalidadNombre = reader.IsDBNull(reader.GetOrdinal("LocalidadNombre")) ? null : reader.GetString(reader.GetOrdinal("LocalidadNombre")),
                    GeneroNombre = null // Si después agregas tabla de Género, se puede mapear
                };
                personas.Add(persona);
            }

            return personas;
        }

        public async Task<Persona?> GetByIdAsync(int id, CancellationToken ct)
        {
            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync(ct);

            var sql = @"
                SELECT 
                    p.Id,
                    p.Legajo,
                    p.Nombre AS PersonaNombre,
                    p.Apellido,
                    p.Tipo_Doc,
                    p.Num_Doc,
                    p.Cuil,
                    p.Calle,
                    p.Altura,
                    p.Cod_Post,
                    p.Id_Provi,
                    p.Id_Partido,
                    p.Id_Local,
                    p.Genero,
                    p.Telefono,
                    p.Email_Personal,
                    pr.Nom_Pro AS ProvinciaNombre,
                    pa.Nom_Partido AS PartidoNombre,
                    l.Nom_Local AS LocalidadNombre
                FROM Persona p
                LEFT JOIN Provincia pr ON p.Id_Provi = pr.Id
                LEFT JOIN Partido pa ON p.Id_Partido = pa.Id
                LEFT JOIN Localidad l ON p.Id_Local = l.Id
                WHERE p.Id = @Id
            ";

            using var cmd = new SqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@Id", id);

            using var reader = await cmd.ExecuteReaderAsync(ct);
            if (await reader.ReadAsync(ct))
            {
                return new Persona
                {
                    Id = reader.GetInt32(reader.GetOrdinal("Id")),
                    Legajo = reader.GetInt32(reader.GetOrdinal("Legajo")),
                    Nombre = reader.IsDBNull(reader.GetOrdinal("PersonaNombre")) ? null : reader.GetString(reader.GetOrdinal("PersonaNombre")),
                    Apellido = reader.IsDBNull(reader.GetOrdinal("Apellido")) ? null : reader.GetString(reader.GetOrdinal("Apellido")),
                    Tipo_Doc = reader.IsDBNull(reader.GetOrdinal("Tipo_Doc")) ? null : reader.GetString(reader.GetOrdinal("Tipo_Doc")),
                    Num_Doc = reader.IsDBNull(reader.GetOrdinal("Num_Doc")) ? null : reader.GetString(reader.GetOrdinal("Num_Doc")),
                    Cuil = reader.IsDBNull(reader.GetOrdinal("Cuil")) ? null : reader.GetString(reader.GetOrdinal("Cuil")),
                    Calle = reader.IsDBNull(reader.GetOrdinal("Calle")) ? null : reader.GetString(reader.GetOrdinal("Calle")),
                    Altura = reader.IsDBNull(reader.GetOrdinal("Altura")) ? null : reader.GetString(reader.GetOrdinal("Altura")),
                    Cod_Post = reader.IsDBNull(reader.GetOrdinal("Cod_Post")) ? 0 : reader.GetInt32(reader.GetOrdinal("Cod_Post")),
                    Id_Provi = reader.IsDBNull(reader.GetOrdinal("Id_Provi")) ? 0 : reader.GetInt32(reader.GetOrdinal("Id_Provi")),
                    Id_Partido = reader.IsDBNull(reader.GetOrdinal("Id_Partido")) ? 0 : reader.GetInt32(reader.GetOrdinal("Id_Partido")),
                    Id_Local = reader.IsDBNull(reader.GetOrdinal("Id_Local")) ? 0 : reader.GetInt32(reader.GetOrdinal("Id_Local")),
                    Genero = reader.IsDBNull(reader.GetOrdinal("Genero")) ? 0 : reader.GetInt32(reader.GetOrdinal("Genero")),
                    Telefono = reader.IsDBNull(reader.GetOrdinal("Telefono")) ? null : reader.GetString(reader.GetOrdinal("Telefono")),
                    Email_Personal = reader.IsDBNull(reader.GetOrdinal("Email_Personal")) ? null : reader.GetString(reader.GetOrdinal("Email_Personal")),
                    ProvinciaNombre = reader.IsDBNull(reader.GetOrdinal("ProvinciaNombre")) ? null : reader.GetString(reader.GetOrdinal("ProvinciaNombre")),
                    PartidoNombre = reader.IsDBNull(reader.GetOrdinal("PartidoNombre")) ? null : reader.GetString(reader.GetOrdinal("PartidoNombre")),
                    LocalidadNombre = reader.IsDBNull(reader.GetOrdinal("LocalidadNombre")) ? null : reader.GetString(reader.GetOrdinal("LocalidadNombre")),
                    GeneroNombre = null
                };
            }

            return null;
        }

        public async Task<int> AddAsync(Persona persona, CancellationToken ct)
        {
            try
            {
                using var conn = new SqlConnection(_connectionString);
                await conn.OpenAsync(ct);
                using var cmd = new SqlCommand(@"
                    INSERT INTO Persona (Legajo, Nombre, Apellido, Tipo_Doc, Num_Doc, Cuil, Calle, Altura, Cod_Post, Id_Provi, Id_Partido, Id_Local, Genero, Telefono, Email_Personal) 
                    VALUES (@Legajo, @Nombre, @Apellido, @Tipo_Doc, @Num_Doc, @Cuil, @Calle, @Altura, @Cod_Post, @Id_Provi, @Id_Partido, @Id_Local, @Genero, @Telefono, @Email_Personal); 
                    SELECT SCOPE_IDENTITY();
                ", conn);
                cmd.Parameters.AddWithValue("@Legajo", persona.Legajo);
                cmd.Parameters.AddWithValue("@Nombre", persona.Nombre ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Apellido", persona.Apellido ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Tipo_Doc", persona.Tipo_Doc ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Num_Doc", persona.Num_Doc ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Cuil", persona.Cuil ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Calle", persona.Calle ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Altura", (object?)persona.Altura ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Cod_Post", persona.Cod_Post);
                cmd.Parameters.AddWithValue("@Genero", persona.Genero);
                cmd.Parameters.AddWithValue("@Id_Provi", persona.Id_Provi);
                cmd.Parameters.AddWithValue("@Id_Partido", persona.Id_Partido);
                cmd.Parameters.AddWithValue("@Id_Local", persona.Id_Local);
                cmd.Parameters.AddWithValue("@Telefono", persona.Telefono ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Email_Personal", persona.Email_Personal ?? (object)DBNull.Value);
                var result = await cmd.ExecuteScalarAsync(ct);
                return Convert.ToInt32(result);
            }
            catch (SqlException)
            {
                return -1;
            }
        }

        public async Task<int> UpdateAsync(Persona persona, CancellationToken ct)
        {
            try
            {
                using var conn = new SqlConnection(_connectionString);
                await conn.OpenAsync(ct);
                using var cmd = new SqlCommand(@"
                    UPDATE Persona 
                    SET Legajo=@Legajo, Nombre=@Nombre, Apellido=@Apellido, Tipo_Doc=@Tipo_Doc, Num_Doc=@Num_Doc, 
                        Cuil=@Cuil, Calle=@Calle, Altura=@Altura, Cod_Post=@Cod_Post, Id_Provi=@Id_Provi, 
                        Id_Partido=@Id_Partido, Id_Local=@Id_Local, Genero=@Genero, Telefono=@Telefono, Email_Personal=@Email_Personal 
                    WHERE Id=@Id
                ", conn);
                cmd.Parameters.AddWithValue("@Id", persona.Id);
                cmd.Parameters.AddWithValue("@Legajo", persona.Legajo);
                cmd.Parameters.AddWithValue("@Nombre", persona.Nombre ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Apellido", persona.Apellido ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Tipo_Doc", persona.Tipo_Doc ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Num_Doc", persona.Num_Doc ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Cuil", persona.Cuil ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Calle", persona.Calle ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Altura", (object?)persona.Altura ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Cod_Post", persona.Cod_Post);
                cmd.Parameters.AddWithValue("@Genero", persona.Genero);
                cmd.Parameters.AddWithValue("@Id_Provi", persona.Id_Provi);
                cmd.Parameters.AddWithValue("@Id_Partido", persona.Id_Partido);
                cmd.Parameters.AddWithValue("@Id_Local", persona.Id_Local);
                cmd.Parameters.AddWithValue("@Telefono", persona.Telefono ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Email_Personal", persona.Email_Personal ?? (object)DBNull.Value);
                return await cmd.ExecuteNonQueryAsync(ct);
            }
            catch (SqlException)
            {
                return -1;
            }
        }
    }
}
