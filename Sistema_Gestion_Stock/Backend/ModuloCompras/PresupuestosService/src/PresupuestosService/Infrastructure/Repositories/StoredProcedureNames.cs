namespace PresupuestosService.Infrastructure.Repositories;

public static class StoredProcedureNames
{
    public const string PresupuestosCreate = "sp_PresupuestosVentas_Create";
    public const string PresupuestosGetById = "sp_PresupuestosVentas_GetById";
    public const string PresupuestosUpdate = "sp_PresupuestosVentas_Update";
    public const string PresupuestosDelete = "sp_PresupuestosVentas_Delete";

    public const string ItemsCreate = "sp_PresupuestosVentasItems_Create";
    public const string ItemsGetById = "sp_PresupuestosVentasItems_GetById";
    public const string ItemsGetByPresupuesto = "sp_PresupuestosVentasItems_GetByPresupuestoVentaId";
    public const string ItemsUpdate = "sp_PresupuestosVentasItems_Update";
}