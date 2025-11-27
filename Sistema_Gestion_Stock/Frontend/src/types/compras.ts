export interface OrdenCompraDTO {
    id: number;
    proveedorId: number;
    fecha: string; // DateTime comes as string
    estado: string;
    observacion?: string;
    activo: boolean;
}

export interface OrdenCompraCreateDTO {
    proveedorId: number;
    fecha: string;
    estado: string;
    observacion?: string;
}

export interface OrdenCompraUpdateDTO {
    proveedorId: number;
    fecha: string;
    estado: string;
    observacion?: string;
    activo: boolean;
}

export interface OrdenCompraItemDTO {
    id: number;
    ordenCompraId: number;
    productoId: number;
    cantidad: number;
    precioUnitario: number;
    activo: boolean;
}

export interface OrdenCompraItemCreateDTO {
    ordenCompraId: number;
    productoId: number;
    cantidad: number;
    precioUnitario: number;
}

export interface OrdenCompraItemUpdateDTO {
    ordenCompraId: number;
    productoId: number;
    cantidad: number;
    precioUnitario: number;
    activo: boolean;
}
