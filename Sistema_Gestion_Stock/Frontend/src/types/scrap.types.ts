// Types for ScrapPage

export interface ScrapDTO {
    idScrap?: number;
    codigo: number;
    idUsuario: number;
    cantidad: number;
    motivo: string;
    observaciones?: string;
    fechaScrap?: string;
}

export interface ProductoScrapDTO {
    codigo: number;
    nombre: string;
    stock: number;
}

export interface Toast {
    id: number;
    type: "success" | "error";
    message: string;
}
