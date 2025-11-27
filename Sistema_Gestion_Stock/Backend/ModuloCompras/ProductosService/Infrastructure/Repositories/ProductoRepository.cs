using System.Data;
using Microsoft.Data.SqlClient;
using ProductosService.Common.Abstractions;
using ProductosService.Common.Enums;
using ProductosService.Domain.Entities;
using ProductosService.Domain.Interfaces;

namespace ProductosService.Infrastructure.Repositories;

public sealed class ProductoRepository : IProductoRepository
{
    private readonly IDbConnectionFactory _factory;

    public ProductoRepository(IDbConnectionFactory factory) => _factory = factory;

    public async Task<int> CreateAsync(Producto e, CancellationToken ct = default)
    {
        using var conn = (SqlConnection)_factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_Productos_Create", conn) { CommandType = CommandType.StoredProcedure };

        cmd.Parameters.AddWithValue("@Codigo", e.Codigo);
        cmd.Parameters.AddWithValue("@Nombre", e.Nombre);
        cmd.Parameters.AddWithValue("@CategoriaId", e.CategoriaId);
        cmd.Parameters.AddWithValue("@MarcaId", e.MarcaId);
        cmd.Parameters.AddWithValue("@Descripcion", (object?)e.Descripcion ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Lote", (object?)e.Lote ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@FechaVencimiento", (object?)e.FechaVencimiento ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@UnidadesAviso", (object?)e.UnidadesAviso ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@PrecioCompra", e.PrecioCompra);
        cmd.Parameters.AddWithValue("@PrecioVenta", (object?)e.PrecioVenta ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@StockActual", e.StockActual);
        cmd.Parameters.AddWithValue("@StockMinimo", (object?)e.StockMinimo ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@StockIdeal", (object?)e.StockIdeal ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@StockMaximo", (object?)e.StockMaximo ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@TipoStock", (object?)e.TipoStock ?? DBNull.Value);
        var outputId = new SqlParameter("@NewId", SqlDbType.Int) { Direction = ParameterDirection.Output };
        cmd.Parameters.Add(outputId);

        await conn.OpenAsync(ct);
        await cmd.ExecuteNonQueryAsync(ct);
        return (int)outputId.Value;
    }

    public async Task<Producto?> GetByCodigoAsync(string codigo, CancellationToken ct = default)
    {
        using var conn = (SqlConnection)_factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_Productos_GetByCodigo", conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@Codigo", codigo);
        await conn.OpenAsync(ct);
        using var reader = await cmd.ExecuteReaderAsync(ct);
        if (!await reader.ReadAsync(ct)) return null;
        return Map(reader);
    }

    public async Task<Producto?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        using var conn = (SqlConnection)_factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_Productos_GetById", conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@Id", id);
        await conn.OpenAsync(ct);
        using var reader = await cmd.ExecuteReaderAsync(ct);
        if (!await reader.ReadAsync(ct)) return null;
        return Map(reader);
    }

    public async Task<IEnumerable<Producto>> SearchAsync(
        string? nombre,
        int? categoriaId,
        int? marcaId,
        EstadoFiltro estado = EstadoFiltro.Activos,
        CancellationToken ct = default)
    {
        using var conn = (SqlConnection)_factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_Productos_Search", conn)
        {
            CommandType = CommandType.StoredProcedure
        };

        if (!string.IsNullOrWhiteSpace(nombre))
            cmd.Parameters.Add(new SqlParameter("@Nombre", SqlDbType.NVarChar, 200) { Value = nombre });

        if (categoriaId.HasValue)
            cmd.Parameters.Add(new SqlParameter("@CategoriaId", SqlDbType.Int) { Value = categoriaId.Value });

        if (marcaId.HasValue)
            cmd.Parameters.Add(new SqlParameter("@MarcaId", SqlDbType.Int) { Value = marcaId.Value });

        cmd.Parameters.Add(new SqlParameter("@Estado", SqlDbType.TinyInt) { Value = (byte)estado });

        var totalCountParam = new SqlParameter("@TotalCount", SqlDbType.Int)
        {
            Direction = ParameterDirection.Output
        };
        cmd.Parameters.Add(totalCountParam);

        await conn.OpenAsync(ct);
        using var reader = await cmd.ExecuteReaderAsync(ct);
        var list = new List<Producto>();

        while (await reader.ReadAsync(ct))
            list.Add(Map(reader));

        await reader.CloseAsync();

        int totalCount = totalCountParam.Value is DBNull ? 0 : (int)totalCountParam.Value;

        return list;
    }


    public async Task UpdateAsync(Producto e, CancellationToken ct = default)
    {
        using var conn = (SqlConnection)_factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_Productos_Update", conn) { CommandType = CommandType.StoredProcedure };

        cmd.Parameters.AddWithValue("@Id", e.Id);
        cmd.Parameters.AddWithValue("@Codigo", e.Codigo);
        cmd.Parameters.AddWithValue("@Nombre", e.Nombre);
        cmd.Parameters.AddWithValue("@CategoriaId", e.CategoriaId);
        cmd.Parameters.AddWithValue("@MarcaId", e.MarcaId);
        cmd.Parameters.AddWithValue("@Descripcion", (object?)e.Descripcion ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Lote", (object?)e.Lote ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@FechaVencimiento", (object?)e.FechaVencimiento ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@UnidadesAviso", (object?)e.UnidadesAviso ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@PrecioCompra", e.PrecioCompra);
        cmd.Parameters.AddWithValue("@PrecioVenta", (object?)e.PrecioVenta ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@StockActual", e.StockActual);
        cmd.Parameters.AddWithValue("@StockMinimo", (object?)e.StockMinimo ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@StockIdeal", (object?)e.StockIdeal ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@StockMaximo", (object?)e.StockMaximo ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@TipoStock", (object?)e.TipoStock ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Activo", e.Activo);

        await conn.OpenAsync(ct);
        await cmd.ExecuteNonQueryAsync(ct);
    }

    public async Task<int> AdjustStockDeltaAsync(int productoId, int delta, CancellationToken ct = default)
    {
        using var conn = (SqlConnection)_factory.CreateConnection();
        using var cmd = new SqlCommand("dbo.sp_Productos_AdjustStockDelta", conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@ProductoId", productoId);
        cmd.Parameters.AddWithValue("@Delta", delta);
        var newStockParam = new SqlParameter("@NewStock", SqlDbType.Int) { Direction = ParameterDirection.Output };
        cmd.Parameters.Add(newStockParam);

        await conn.OpenAsync(ct);
        await cmd.ExecuteNonQueryAsync(ct);
        return (int)newStockParam.Value;
    }

    private static Producto Map(IDataRecord r) => new()
    {
        Id = r.GetInt32(r.GetOrdinal("Id")),
        Codigo = r.GetString(r.GetOrdinal("Codigo")),
        Nombre = r.GetString(r.GetOrdinal("Nombre")),
        CategoriaId = r.GetInt32(r.GetOrdinal("CategoriaId")),
        MarcaId = r.GetInt32(r.GetOrdinal("MarcaId")),
        Descripcion = r.IsDBNull(r.GetOrdinal("Descripcion")) ? null : r.GetString(r.GetOrdinal("Descripcion")),
        Lote = r.IsDBNull(r.GetOrdinal("Lote")) ? null : r.GetString(r.GetOrdinal("Lote")),
        FechaVencimiento = r.IsDBNull(r.GetOrdinal("FechaVencimiento")) ? null : r.GetDateTime(r.GetOrdinal("FechaVencimiento")),
        UnidadesAviso = r.IsDBNull(r.GetOrdinal("UnidadesAviso")) ? null : r.GetInt32(r.GetOrdinal("UnidadesAviso")),
        PrecioCompra = r.GetDecimal(r.GetOrdinal("PrecioCompra")),
        PrecioVenta = r.IsDBNull(r.GetOrdinal("PrecioVenta")) ? null : r.GetDecimal(r.GetOrdinal("PrecioVenta")),
        StockActual = r.GetInt32(r.GetOrdinal("StockActual")),
        StockMinimo = r.IsDBNull(r.GetOrdinal("StockMinimo")) ? null : r.GetInt32(r.GetOrdinal("StockMinimo")),
        StockIdeal = r.IsDBNull(r.GetOrdinal("StockIdeal")) ? null : r.GetInt32(r.GetOrdinal("StockIdeal")),
        StockMaximo = r.IsDBNull(r.GetOrdinal("StockMaximo")) ? null : r.GetInt32(r.GetOrdinal("StockMaximo")),
        TipoStock = r.IsDBNull(r.GetOrdinal("TipoStock")) ? null : r.GetString(r.GetOrdinal("TipoStock")),
        Activo = !r.IsDBNull(r.GetOrdinal("Activo")) && r.GetBoolean(r.GetOrdinal("Activo"))
    };
}