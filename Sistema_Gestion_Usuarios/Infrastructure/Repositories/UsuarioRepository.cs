using System.Text;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using Domain.Entities;
using Domain.Interfaces;
using Common;

namespace Infrastructure.Repositories
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly string _connectionString;
        public UsuarioRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<List<Usuario>> GetAllAsync(CancellationToken ct)
        {
            var usuarios = new List<Usuario>();
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("SELECT Id, Nombre_Usuario, Contraseña, Fecha_Block, Usuario_Bloqueado, Fecha_Usu_Cambio, Id_Rol, Id_Per, PrimeraVez FROM Usuarios", connection);
            await connection.OpenAsync(ct);
            using var reader = await command.ExecuteReaderAsync(ct);
            while (await reader.ReadAsync(ct))
            {
                usuarios.Add(new Usuario
                {
                    Id = reader.GetInt32(0),
                    Nombre_Usuario = reader.IsDBNull(1) ? null : reader.GetString(1),
                    Contraseña = reader.IsDBNull(2) ? null : reader.GetString(2),
                    Fecha_Block = reader.IsDBNull(3) ? null : reader.GetDateTime(3),
                    Usuario_Bloqueado = reader.GetBoolean(4),
                    Fecha_Usu_Cambio = reader.IsDBNull(5) ? null : reader.GetDateTime(5),
                    Id_Rol = reader.GetInt32(6),
                    Id_Per = reader.GetInt32(7),
                    PrimeraVez = reader.GetBoolean(8)
                });
            }
            return usuarios;
        }

        public async Task<Usuario?> GetByIdAsync(int id, CancellationToken ct)
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("SELECT Id, Nombre_Usuario, Contraseña, Fecha_Block, Usuario_Bloqueado, Fecha_Usu_Cambio, Id_Rol, Id_Per, PrimeraVez FROM Usuarios WHERE Id = @Id", connection);
            command.Parameters.AddWithValue("@Id", id);
            await connection.OpenAsync(ct);
            using var reader = await command.ExecuteReaderAsync(ct);
            if (await reader.ReadAsync(ct))
            {
                return new Usuario
                {
                    Id = reader.GetInt32(0),
                    Nombre_Usuario = reader.IsDBNull(1) ? null : reader.GetString(1),
                    Contraseña = reader.IsDBNull(2) ? null : reader.GetString(2),
                    Fecha_Block = reader.IsDBNull(3) ? null : reader.GetDateTime(3),
                    Usuario_Bloqueado = reader.GetBoolean(4),
                    Fecha_Usu_Cambio = reader.IsDBNull(5) ? null : reader.GetDateTime(5),
                    Id_Rol = reader.GetInt32(6),
                    Id_Per = reader.GetInt32(7),
                    PrimeraVez = reader.GetBoolean(8)
                };
            }
            return null;
        }

        public async Task<int> AddAsync(Usuario usuario, CancellationToken ct)
        {
            using var connection = new SqlConnection(_connectionString);
            DateTime fechaUltCambio = DateTime.UtcNow;
            DateTime? fechaBlock = usuario.Usuario_Bloqueado ? DateTime.UtcNow : null;
            using var command = new SqlCommand(
                @"INSERT INTO Usuarios (Nombre_Usuario, Contraseña, Fecha_Block, Usuario_Bloqueado, Fecha_Usu_Cambio, Id_Rol, Id_Per, PrimeraVez)
                    OUTPUT INSERTED.Id
                    VALUES (@Nombre_Usuario, @Contraseña, @Fecha_Block, @Usuario_Bloqueado, @Fecha_Ult_Cambio, @Id_Rol, @Id_Per, @PrimeraVez)", connection);

            command.Parameters.AddWithValue("@Nombre_Usuario", (object?)usuario.Nombre_Usuario ?? DBNull.Value);
            command.Parameters.AddWithValue("@Contraseña", usuario.Contraseña);
            command.Parameters.AddWithValue("@Fecha_Block", (object?)fechaBlock ?? DBNull.Value);
            command.Parameters.AddWithValue("@Usuario_Bloqueado", usuario.Usuario_Bloqueado);
            command.Parameters.AddWithValue("@Fecha_Ult_Cambio", fechaUltCambio);
            command.Parameters.AddWithValue("@Id_Rol", usuario.Id_Rol);
            command.Parameters.AddWithValue("@Id_Per", usuario.Id_Per);
            command.Parameters.AddWithValue("@PrimeraVez", usuario.PrimeraVez);

            await connection.OpenAsync(ct);
            return (int)await command.ExecuteScalarAsync(ct);
        }

        public async Task<bool> UpdateAsync(Usuario usuario, CancellationToken ct)
{
    using var connection = new SqlConnection(_connectionString);
    Usuario? usuarioActual = await GetByIdAsync(usuario.Id, ct);
    if (usuarioActual == null) return false;

    DateTime? nuevaFechaBlock = usuario.Usuario_Bloqueado ? DateTime.UtcNow : null;
    DateTime nuevaFechaUltCambio = usuario.Fecha_Usu_Cambio ?? DateTime.UtcNow;

    // 🔹 Armamos la base del query
    var query = new StringBuilder(@"
        UPDATE Usuarios SET
            Nombre_Usuario = @Nombre_Usuario,
            Fecha_Block = @Fecha_Block,
            Usuario_Bloqueado = @Usuario_Bloqueado,
            Fecha_Usu_Cambio = @Fecha_Ult_Cambio,
            Id_Rol = @Id_Rol,
            Id_Per = @Id_Per,
            PrimeraVez = @PrimeraVez");

    // 🔹 Solo agregamos el campo Contraseña si viene una nueva
    if (!string.IsNullOrEmpty(usuario.Contraseña))
        query.Append(", Contraseña = @Contraseña");

    query.Append(" WHERE Id = @Id");

    using var command = new SqlCommand(query.ToString(), connection);

    command.Parameters.AddWithValue("@Id", usuario.Id);
    command.Parameters.AddWithValue("@Nombre_Usuario", (object?)usuario.Nombre_Usuario ?? DBNull.Value);
    command.Parameters.AddWithValue("@Fecha_Block", (object?)nuevaFechaBlock ?? DBNull.Value);
    command.Parameters.AddWithValue("@Usuario_Bloqueado", usuario.Usuario_Bloqueado);
    command.Parameters.AddWithValue("@Fecha_Ult_Cambio", nuevaFechaUltCambio);
    command.Parameters.AddWithValue("@Id_Rol", usuario.Id_Rol);
    command.Parameters.AddWithValue("@Id_Per", usuario.Id_Per);
    command.Parameters.AddWithValue("@PrimeraVez", usuario.PrimeraVez);

    if (!string.IsNullOrEmpty(usuario.Contraseña))
        command.Parameters.AddWithValue("@Contraseña", usuario.Contraseña);

    await connection.OpenAsync(ct);
    return await command.ExecuteNonQueryAsync(ct) > 0;
}


        public async Task<List<UsuarioDto>> GetAllWithNamesAsync(CancellationToken ct)
        {
            var usuarios = new List<UsuarioDto>();
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand(@"
                SELECT u.Id, u.Nombre_Usuario, u.Id_Rol, r.Rol as Nombre_Rol, u.Id_Per, 
                       p.Nombre as Nombre_Persona, p.Apellido as Apellido_Persona, u.Usuario_Bloqueado, u.PrimeraVez,
                       u.Fecha_Block, u.Fecha_Usu_Cambio
                FROM Usuarios u
                LEFT JOIN Roles r ON u.Id_Rol = r.Id
                LEFT JOIN Persona p ON u.Id_Per = p.Id
            ", connection);
            await connection.OpenAsync(ct);
            using var reader = await command.ExecuteReaderAsync(ct);
            while (await reader.ReadAsync(ct))
            {
                string nombrePersona = reader.IsDBNull(5) ? "" : reader.GetString(5);
                string apellidoPersona = reader.FieldCount > 6 && !reader.IsDBNull(6) ? reader.GetString(6) : "";
                if (!string.IsNullOrEmpty(apellidoPersona)) nombrePersona += " " + apellidoPersona;
                usuarios.Add(new UsuarioDto
                {
                    Id = reader.GetInt32(0),
                    Nombre_Usuario = reader.IsDBNull(1) ? null : reader.GetString(1),
                    Id_Rol = reader.GetInt32(2),
                    Id_Per = reader.GetInt32(4),
                    Nombre_Persona = nombrePersona,
                    Usuario_Bloqueado = reader.GetBoolean(7),
                    PrimeraVez = reader.GetBoolean(8),
                    Fecha_Block = reader.IsDBNull(9) ? (DateTime?)null : reader.GetDateTime(9),
                    Fecha_Ult_Cambio = reader.IsDBNull(10) ? (DateTime?)null : reader.GetDateTime(10)
                });
            }
            return usuarios;
        }

        public async Task<List<UsuarioDto>> GetAllWithNamesByNombreAsync(string nombre, CancellationToken ct)
        {
            var usuarios = new List<UsuarioDto>();
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand(@"
                SELECT u.Id, u.Nombre_Usuario, u.Id_Rol, r.Rol as Nombre_Rol, u.Id_Per, 
                       p.Nombre as Nombre_Persona, p.Apellido as Apellido_Persona, u.Usuario_Bloqueado, u.PrimeraVez,
                       u.Fecha_Block, u.Fecha_Usu_Cambio
                FROM Usuarios u
                LEFT JOIN Roles r ON u.Id_Rol = r.Id
                LEFT JOIN Persona p ON u.Id_Per = p.Id
                WHERE LOWER(u.Nombre_Usuario) LIKE '%' + LOWER(@nombre) + '%'
            ", connection);
            command.Parameters.AddWithValue("@nombre", nombre);
            await connection.OpenAsync(ct);
            using var reader = await command.ExecuteReaderAsync(ct);
            while (await reader.ReadAsync(ct))
            {
                string nombrePersona = reader.IsDBNull(5) ? "" : reader.GetString(5);
                string apellidoPersona = reader.FieldCount > 6 && !reader.IsDBNull(6) ? reader.GetString(6) : "";
                if (!string.IsNullOrEmpty(apellidoPersona)) nombrePersona += " " + apellidoPersona;
                usuarios.Add(new UsuarioDto
                {
                    Id = reader.GetInt32(0),
                    Nombre_Usuario = reader.IsDBNull(1) ? null : reader.GetString(1),
                    Id_Rol = reader.GetInt32(2),
                    Id_Per = reader.GetInt32(4),
                    Nombre_Persona = nombrePersona,
                    Usuario_Bloqueado = reader.GetBoolean(7),
                    PrimeraVez = reader.GetBoolean(8),
                    Fecha_Block = reader.IsDBNull(9) ? (DateTime?)null : reader.GetDateTime(9),
                    Fecha_Ult_Cambio = reader.IsDBNull(10) ? (DateTime?)null : reader.GetDateTime(10)
                });
            }
            return usuarios;
        }

        public async Task<List<UsuarioDto>> GetIdAndNombreAsync(CancellationToken ct)
        {
            var usuarios = new List<UsuarioDto>();
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("SELECT Id, Nombre_Usuario FROM Usuarios", connection);
            await connection.OpenAsync(ct);
            using var reader = await command.ExecuteReaderAsync(ct);
            while (await reader.ReadAsync(ct))
            {
                usuarios.Add(new UsuarioDto
                {
                    Id = reader.GetInt32(0),
                    Nombre_Usuario = reader.IsDBNull(1) ? null : reader.GetString(1)
                });
            }
            return usuarios;
        }
        public async Task<UsuarioDto?> GetByNombreUsuarioAsync(string nombreUsuario, CancellationToken ct)
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand(@"
        SELECT u.Id, u.Nombre_Usuario, u.Id_Rol, r.Rol as Nombre_Rol, u.Id_Per, 
               p.Nombre as Nombre_Persona, p.Apellido as Apellido_Persona, 
               u.Usuario_Bloqueado, u.PrimeraVez, u.Fecha_Block, u.Fecha_Usu_Cambio
        FROM Usuarios u
        LEFT JOIN Roles r ON u.Id_Rol = r.Id
        LEFT JOIN Persona p ON u.Id_Per = p.Id
        WHERE LOWER(u.Nombre_Usuario) = LOWER(@nombreUsuario)
    ", connection);
            command.Parameters.AddWithValue("@nombreUsuario", nombreUsuario);

            await connection.OpenAsync(ct);
            using var reader = await command.ExecuteReaderAsync(ct);
            if (await reader.ReadAsync(ct))
            {
                string nombrePersona = reader.IsDBNull(5) ? "" : reader.GetString(5);
                string apellidoPersona = reader.FieldCount > 6 && !reader.IsDBNull(6) ? reader.GetString(6) : "";
                if (!string.IsNullOrEmpty(apellidoPersona)) nombrePersona += " " + apellidoPersona;

                return new UsuarioDto
                {
                    Id = reader.GetInt32(0),
                    Nombre_Usuario = reader.IsDBNull(1) ? null : reader.GetString(1),
                    Id_Rol = reader.GetInt32(2),
                    Id_Per = reader.GetInt32(4),
                    Nombre_Persona = nombrePersona,
                    Usuario_Bloqueado = reader.GetBoolean(7),
                    PrimeraVez = reader.GetBoolean(8),
                    Fecha_Block = reader.IsDBNull(9) ? (DateTime?)null : reader.GetDateTime(9),
                    Fecha_Ult_Cambio = reader.IsDBNull(10) ? (DateTime?)null : reader.GetDateTime(10)
                };
            }

            return null;
        }




        // 🔹 Método nuevo: obtener usuario exacto por nombre
        public async Task<Usuario?> GetByNombreExactoAsync(string nombre, CancellationToken ct)
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand(
                @"SELECT Id, Nombre_Usuario, Contraseña, Fecha_Block, Usuario_Bloqueado, Fecha_Usu_Cambio, Id_Rol, Id_Per, PrimeraVez
                  FROM Usuarios
                  WHERE Nombre_Usuario = @NombreUsuario", connection);
            command.Parameters.AddWithValue("@NombreUsuario", nombre);
            await connection.OpenAsync(ct);
            using var reader = await command.ExecuteReaderAsync(ct);
            if (await reader.ReadAsync(ct))
            {
                return new Usuario
                {
                    Id = reader.GetInt32(0),
                    Nombre_Usuario = reader.IsDBNull(1) ? null : reader.GetString(1),
                    Contraseña = reader.IsDBNull(2) ? null : reader.GetString(2),
                    Fecha_Block = reader.IsDBNull(3) ? null : reader.GetDateTime(3),
                    Usuario_Bloqueado = reader.GetBoolean(4),
                    Fecha_Usu_Cambio = reader.IsDBNull(5) ? null : reader.GetDateTime(5),
                    Id_Rol = reader.GetInt32(6),
                    Id_Per = reader.GetInt32(7),
                    PrimeraVez = reader.GetBoolean(8)
                };
            }
            return null;
        }
        public async Task GuardarRespuestaAsync(Respuesta respuesta, CancellationToken ct)
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand(
                @"INSERT INTO Respuestas (Id_User, Id_Pregun, Respuesta)
          VALUES (@Id_User, @Id_Pregun, @Respuesta)", connection);

            command.Parameters.AddWithValue("@Id_User", respuesta.Id_User);
            command.Parameters.AddWithValue("@Id_Pregun", respuesta.Id_Pregun);
            command.Parameters.AddWithValue("@Respuesta", respuesta.Texto ?? (object)DBNull.Value);

            await connection.OpenAsync(ct);
            await command.ExecuteNonQueryAsync(ct);
        }

        public async Task<(Usuario? usuario, string? email)> GetUsuarioConEmailAsync(string usuarioOEmail)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var query = @"
        SELECT TOP 1 
            u.Id,
            u.Nombre_Usuario,
            u.Contraseña,
            u.Id_Per,
            p.Email_Personal
        FROM Usuarios u
        INNER JOIN Persona p ON u.Id_Per = p.Id
        WHERE u.Nombre_Usuario = @dato OR p.Email_Personal = @dato";

            using var command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@dato", usuarioOEmail);

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                var usuario = new Usuario
                {
                    Id = reader.GetInt32(reader.GetOrdinal("Id")),
                    Nombre_Usuario = reader.GetString(reader.GetOrdinal("Nombre_Usuario")),
                    Contraseña = reader.GetString(reader.GetOrdinal("Contraseña")),
                    Id_Per = reader.GetInt32(reader.GetOrdinal("Id_Per"))
                };

                var email = reader.GetString(reader.GetOrdinal("Email_Personal"));
                return (usuario, email);
            }

            return (null, null);
        }

        public async Task<List<string>> GetPermisosUsuarioAsync(int idUsuario, CancellationToken ct)
        {
            var permisos = new List<string>();

            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync(ct);

            var query = @"
        SELECT DISTINCT p.Permiso
        FROM Permisos p
        INNER JOIN Permisos_Rol pr ON p.Id = pr.Id_Permi
        INNER JOIN Usuarios u ON u.Id_Rol = pr.Id_Rol
        WHERE u.Id = @IdUsuario

        UNION

        SELECT DISTINCT p2.Permiso
        FROM Permisos p2
        INNER JOIN Permisos_User pu ON p2.Id = pu.Id_Permi
        WHERE pu.Id_User = @IdUsuario AND pu.Fecha_Vto >= GETDATE()
    ";

            using var command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@IdUsuario", idUsuario);

            using var reader = await command.ExecuteReaderAsync(ct);
            while (await reader.ReadAsync(ct))
            {
                permisos.Add(reader.GetString(reader.GetOrdinal("Permiso")));
            }

            return permisos;
        }


    }
}