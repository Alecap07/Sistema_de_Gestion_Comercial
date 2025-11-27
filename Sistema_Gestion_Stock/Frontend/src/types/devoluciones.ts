export interface DevolucionVentaDTO {
    id: number;
    clienteId: number;
    notaPedidoVentaId?: number;
    fecha: string;
    motivo?: string;
    activo: boolean;
    items: DevolucionVentaItemDTO[];
}

export interface DevolucionVentaCreateDTO {
    clienteId: number;
    notaPedidoVentaId?: number;
    fecha: string;
    motivo?: string;
    activo?: boolean;
}

export interface DevolucionVentaUpdateDTO {
    clienteId?: number;
    notaPedidoVentaId?: number;
    fecha?: string;
    motivo?: string;
    activo?: boolean;
}

export interface DevolucionVentaItemDTO {
    id: number;
    devolucionVentaId: number;
    productoId: number;
    cantidad: number;
    activo: boolean;
}

export interface DevolucionVentaItemCreateDTO {
    devolucionVentaId: number;
    productoId: number;
    cantidad: number;
    activo?: boolean;
}

export interface DevolucionVentaItemUpdateDTO {
    devolucionVentaId?: number;
    productoId?: number;
    cantidad?: number;
    activo?: boolean;
}
