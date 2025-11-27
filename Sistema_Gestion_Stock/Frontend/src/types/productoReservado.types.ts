// Types for ProductoReservado entity

export interface ProductoReservadoReadDTO {
    id: number;
    notaPedidoVentaId: number;
    productoId: number;
    cantidad: number;
    fechaReserva: string;
    activo: boolean;
}

export interface NotaPedidoDTO {
    id: number;
    observacion: string;
}

export interface ProductoDTO {
    id: number;
    codigo: string;
    nombre: string;
}
