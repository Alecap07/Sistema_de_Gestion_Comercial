// DTOs para Facturas de Compra
export interface FacturaCompraDTO {
    id: number;
    proveedorId: number;
    numeroFactura: string | null;
    fecha: string;
    total: number;
    activo: boolean;
}

export interface FacturaCompraCreateDTO {
    proveedorId: number;
    numeroFactura: string | null;
    fecha: string;
    total: number;
}

export interface FacturaCompraUpdateDTO {
    proveedorId: number;
    numeroFactura: string | null;
    fecha: string;
    total: number;
    activo: boolean;
}

// DTOs para Items de Factura
export interface FacturaCompraItemDTO {
    id: number;
    facturaId: number;
    productoId: number;
    cantidad: number;
    precioUnitario: number;
    activo: boolean;
}

export interface FacturaCompraItemCreateDTO {
    facturaId: number;
    productoId: number;
    cantidad: number;
    precioUnitario: number;
}

export interface FacturaCompraItemUpdateDTO {
    facturaId: number;
    productoId: number;
    cantidad: number;
    precioUnitario: number;
    activo: boolean;
}
