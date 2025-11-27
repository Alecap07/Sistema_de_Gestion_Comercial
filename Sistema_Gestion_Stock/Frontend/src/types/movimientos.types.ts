// Types for MovimientosPage

export interface MovimientoStockDTO {
    idMovimiento?: number;
    codigo: number;
    tipoMovimiento: "Entrada" | "Salida";
    cantidad: number;
    idOrden?: number | null;
    observaciones?: string;
    fechaMovimiento?: string;
}
