// Types for Producto entity

export interface ProductoDTO {
    id: number;
    codigo: string;
    nombre: string;
    categoriaId: number;
    marcaId: number;
    descripcion?: string | null;
    lote?: string | null;
    fechaVencimiento?: string | null;
    unidadesAviso?: number | null;
    precioCompra: number;
    precioVenta?: number | null;
    stockActual: number;
    stockMinimo?: number | null;
    stockIdeal?: number | null;
    stockMaximo?: number | null;
    tipoStock?: string | null;
    activo: boolean;
}
