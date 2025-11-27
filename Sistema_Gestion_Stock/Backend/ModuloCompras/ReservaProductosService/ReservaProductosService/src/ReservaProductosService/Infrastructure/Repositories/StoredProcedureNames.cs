namespace ReservaProductosService.Infrastructure.Repositories;

public static class StoredProcedureNames
{
    public const string ProductosReservadosCreate = "sp_ProductosReservados_Create";
    public const string ProductosReservadosGetById = "sp_ProductosReservados_GetById";
    public const string ProductosReservadosList = "sp_ProductosReservados_List";
    public const string ProductosReservadosUpdate = "sp_ProductosReservados_Update";
    public const string ProductosReservadosCancel = "sp_ProductosReservados_Cancel";
}