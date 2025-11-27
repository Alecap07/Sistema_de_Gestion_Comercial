using ReservaProductosService.Domain.Entities;

namespace ReservaProductosService.Domain.Repositories;

public interface IProductosReservadosRepository
{
    Task<int> CreateAsync(ProductoReservado entity);          // sp_ProductosReservados_Create
    Task<ProductoReservado?> GetByIdAsync(int id);            // sp_ProductosReservados_GetById (incluye inactivo)
    Task<IReadOnlyList<ProductoReservado>> ListAsync(bool soloActivos, bool soloInactivos); // sp_ProductosReservados_List con filtro
    Task<bool> UpdateAsync(ProductoReservado entity);         // sp_ProductosReservados_Update
    Task<bool> CancelAsync(int id);                           // sp_ProductosReservados_Cancel (Activo = 0)
}