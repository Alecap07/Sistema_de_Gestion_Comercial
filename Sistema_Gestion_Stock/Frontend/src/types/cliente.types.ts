// Types for Cliente entity

export interface ClienteReadDTO {
    id: number;
    personaId: number;
    codigo: string;
    limiteCredito: number;
    descuento: number;
    formasPago: string;
    observacion: string;
    activo: boolean;
}

export interface PersonaDTO {
    Id: number;
    Nombre: string;
    Apellido: string;
}

export interface ClienteFormState {
    id: number;
    personaId: number;
    codigo: string;
    limiteCredito: string;
    descuento: string;
    formasPago: string;
    observacion: string;
    activo: boolean;
}
