// Types for Remitos Service

export interface RemitoDTO {
    id: number;
    ordenCompraId?: number | null;
    proveedorId: number;
    fecha: string;
    observacion?: string | null;
    activo: boolean;
}

export interface RemitoCreateDTO {
    ordenCompraId?: number | null;
    proveedorId: number;
    fecha: string;
    observacion?: string | null;
}

export interface RemitoUpdateDTO {
    ordenCompraId?: number | null;
    proveedorId: number;
    fecha: string;
    observacion?: string | null;
    activo: boolean;
}

export interface RemitoItemDTO {
    id: number;
    remitoId: number;
    productoId: number;
    cantidad: number;
    activo: boolean;
}

export interface RemitoItemCreateDTO {
    remitoId: number;
    productoId: number;
    cantidad: number;
}

export interface RemitoItemUpdateDTO {
    remitoId: number;
    productoId: number;
    cantidad: number;
    activo: boolean;
}
