// Types for NotasPedido entity

export interface NotasPedidoDTO {
    id: number;
    clienteId: number;
    observacion: string;
    fecha: string;
    estado: string;
    activo: boolean;
}
