// Types for NotasPedidoItem entity

export interface NotaPedidoVentaItemDTO {
    id: number;
    notaPedidoVentaId: number;
    productoId: number;
    cantidad: number;
    precioUnitario: number;
    activo: boolean;
}
