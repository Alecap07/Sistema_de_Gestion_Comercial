export interface NotaDebitoVentaReadDTO {
    id: number;
    clienteId: number;
    fecha: string;
    motivo?: string;
    monto: number;
    notaPedidoVentaId?: number;
    activo: boolean;
}

export interface NotaDebitoVentaCreateDTO {
    clienteId: number;
    fecha: string;
    motivo?: string;
    monto: number;
    notaPedidoVentaId?: number;
    activo: boolean;
}

export interface NotaDebitoVentaUpdateDTO {
    clienteId?: number;
    fecha?: string;
    motivo?: string;
    monto?: number;
    notaPedidoVentaId?: number;
    activo?: boolean;
}
