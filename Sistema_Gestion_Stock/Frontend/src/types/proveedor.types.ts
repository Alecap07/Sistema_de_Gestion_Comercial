// Types for Proveedor entity

export interface ProveedorDTO {
    id?: number;
    personaId: number;
    codigo: string;
    razonSocial: string;
    formaPago?: string;
    tiempoEntregaDias?: number;
    descuentosOtorgados?: string;
    activo: boolean;
}
