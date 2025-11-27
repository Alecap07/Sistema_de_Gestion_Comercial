using Domain.Entities;
using Domain.Interfaces;
using Microsoft.Data.SqlClient;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class RestriccionRepository : IRestriccionRepository
    {
        private readonly string _connectionString;
        public RestriccionRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<IEnumerable<Restriccion>> GetAllAsync()
        {
            var restricciones = new List<Restriccion>();
            using (var conn = new SqlConnection(_connectionString))
            {
                string sql = "SELECT Id, Cod_Restri, Descripcion, Id_TipoRestri, Activa, Cantidad FROM Restricciones";
                var cmd = new SqlCommand(sql, conn);
                await conn.OpenAsync();
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        restricciones.Add(new Restriccion
                        {
                            Id = reader.GetInt32(0),
                            Cod_Restri = reader.IsDBNull(1) ? null : reader.GetString(1),
                            Descripcion = reader.IsDBNull(2) ? null : reader.GetString(2),
                            Id_TipoRestri = reader.GetInt32(3),
                            Activa = reader.GetBoolean(4),
                            Cantidad = reader.GetInt32(5)
                        });
                    }
                }
            }
            return restricciones;
        }

        public async Task<Restriccion?> GetByIdAsync(int id)
        {
            using (var conn = new SqlConnection(_connectionString))
            {
                string sql = "SELECT Id, Cod_Restri, Descripcion, Id_TipoRestri, Activa, Cantidad FROM Restricciones WHERE Id = @id";
                var cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@id", id);
                await conn.OpenAsync();
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    if (await reader.ReadAsync())
                    {
                        return new Restriccion
                        {
                            Id = reader.GetInt32(0),
                            Cod_Restri = reader.IsDBNull(1) ? null : reader.GetString(1),
                            Descripcion = reader.IsDBNull(2) ? null : reader.GetString(2),
                            Id_TipoRestri = reader.GetInt32(3),
                            Activa = reader.GetBoolean(4),
                            Cantidad = reader.GetInt32(5)
                        };
                    }
                }
            }
            return null;
        }

        public async Task UpdateAsync(Restriccion restriccion)
        {
            using (var conn = new SqlConnection(_connectionString))
            {
                string sql = "UPDATE Restricciones SET Cod_Restri = @Cod_Restri, Descripcion = @Descripcion, Id_TipoRestri = @Id_TipoRestri, Activa = @Activa, Cantidad = @Cantidad WHERE Id = @Id";
                var cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Id", restriccion.Id);
                cmd.Parameters.AddWithValue("@Cod_Restri", (object?)restriccion.Cod_Restri ?? System.DBNull.Value);
                cmd.Parameters.AddWithValue("@Descripcion", (object?)restriccion.Descripcion ?? System.DBNull.Value);
                cmd.Parameters.AddWithValue("@Id_TipoRestri", restriccion.Id_TipoRestri);
                cmd.Parameters.AddWithValue("@Activa", restriccion.Activa);
                cmd.Parameters.AddWithValue("@Cantidad", restriccion.Cantidad);
                await conn.OpenAsync();
                await cmd.ExecuteNonQueryAsync();
            }
        }
    }
}
