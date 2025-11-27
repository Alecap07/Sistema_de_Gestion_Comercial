export interface NotaCreditoVentaReadDTO {
    id: number;
    clienteId: number;
    fecha: string; // DateTime comes as string from API usually
    motivo?: string;
    monto: number;
    notaPedidoVentaId?: number;
    activo: boolean;
}

export interface NotaCreditoVentaCreateDTO {
    clienteId: number;
    fecha: string;
    motivo?: string;
    monto: number;
    notaPedidoVentaId?: number;
    activo: boolean;
}

export interface NotaCreditoVentaUpdateDTO {
    clienteId?: number;
    fecha?: string;
    motivo?: string;
    monto?: number;
    notaPedidoVentaId?: number;
    activo?: boolean;
}
