// Types for Presupuesto entity

export interface PresupuestoDTO {
    id: number;
    clienteId: number;
    fecha: string;
    estado: string;
    observacion?: string;
    activo: boolean;
}

export interface PresupuestoFormStateDTO {
    id: number;
    clienteId: number;
    fecha: string;
    estado: string;
    observacion?: string;
    activo: boolean;
}

export interface PresupuestoVentaItemDTO {
    id: number;
    presupuestoVentaId: number;
    productoId: number;
    cantidad: number;
    precioUnitario: number;
    activo: boolean;
}

export interface PresupuestoVentaItemFormStateDTO {
    id: number;
    presupuestoVentaId: number;
    productoId: number;
    cantidad: number;
    precioUnitario: number;
    activo: boolean;
}
