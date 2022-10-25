


export class Tramite_Model {
    id_tramite?: number
    id_TipoTramite: number
    estado: string
    alterno: string
    pin: number
    detalle: string
    cantidad: string
    activo: boolean
    id_cuenta: number
    fecha_creacion: any
    fecha_finalizacion: any
    id_solicitante: any
    id_representante: any
    id_interno: any
    id_requerimientos: string
    cite: string


    constructor(
        id_TipoTramite: number,
        detalle: string,
        cantidad: string,
        alterno: string,
        id_requerimientos: string | "",
        cite: string
    ) {
        this.id_TipoTramite = id_TipoTramite
        this.estado = "Inscrito"
        this.alterno = alterno
        this.pin = Math.floor(1000 + Math.random() * 90000);
        this.detalle = detalle.toUpperCase()
        this.cantidad = cantidad
        this.activo = true
        this.fecha_finalizacion = null
        this.id_interno = null
        this.id_solicitante = null
        this.id_representante = null
        this.id_requerimientos = id_requerimientos
        this.cite = cite.toUpperCase()
    }
}
export interface TramiteModel_View {
    fecha_creacion: number
    alterno: string
    dni: number
    pin: number
    cite:string 
    cantidad:string
    detalle:string
    enviado: boolean
    estado: string
    expedido: string
    id_representante: number
    id_solicitante: number
    id_tramite: number
    nombre: string,
    apellido_p: string,
    apellido_m: string
    tipo_solicitante: string
    titulo: string
    solicitante?: string
}

export interface TramiteFichaModel {
    id_tramite: number,
    id_TipoTramite: number,
    id_solicitante: number,
    id_representante: number,
    id_interno: number,
    id_cuenta: number,
    estado: string,
    alterno: string,
    pin: string,
    detalle: string,
    cantidad: string,
    activo: boolean,
    cite: string
    fecha_creacion: string,
    fecha_finalizacion: string,
    id_requerimientos: string,
    titulo: string
}


export interface TramiteInternoModel_View {
    id_tramite: number
    id_interno: number
    estado: string
    alterno: string
    detalle: string
    cantidad: string
    cite: string
    fecha_creacion: string
    numero_correlativo: string
    remitente: string
    cargo_remitente: string
    destinatario: string
    cargo_destinatario: string
    titulo: string
    enviado: boolean
}


export interface ObservacionModel {
    id_observacion?: number
    id_cuenta?: number
    id_tramite: number
    detalle: string
    fecha_registro?: string
    situacion?: boolean
}

export interface ObservacionModel_View {
    id_observacion: number
    id_cuenta: number
    fecha_registro: string
    detalle: string
    situacion: boolean
    funcionario: string
    cargo: string
    dependencia: string
}





