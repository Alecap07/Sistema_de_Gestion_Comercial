// Types for ProductosPage

export interface ProductoAlmacenDTO {
    idProducto?: number;
    codigo: string;
    nombre: string;
    descripcion: string;
    precio: number | string;
    stock: number | string;
    lote: string;
    fechaVencimiento: string;
    activo?: boolean;
}

export interface Toast {
    id: number;
    type: "success" | "error";
    message: string;
}
