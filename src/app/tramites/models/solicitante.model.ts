export interface SolicitanteModel {
    id_solicitante?: number
    id_documento: number
    dni: number
    expedido: string
    nombre: string
    apellido_p: string
    apellido_m: string
    telefono: number
    tipo_solicitante: string
}
export interface RepresentanteModel {
    id_representante?: number
    id_documento: number
    dni: number
    expedido: string
    nombre: string
    apellido_p: string
    apellido_m: string
    telefono: number
}

export interface InternoModel {
    id_inteno?: number,
    numero_correlativo: number,
    remitente: string,
    cargo_remitente: string,
    destinatario: string,
    cargo_destinatario: string
}
