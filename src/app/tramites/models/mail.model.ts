export interface BandejaEntradaModel {
    id_tramite: number
    id_cuentaEmisor: number
    id_cuentaReceptor: number
    detalle: string
    fecha_envio?: string
    aceptado?: boolean
}
export interface BandejaSalidaModel {
    id_bandeja?: number
    id_tramite: number
    id_cuentaEmisor: number
    id_cuentaReceptor: number
    detalle: string
    fecha_envio?: string
    fecha_recibido?: string
    aceptado?: boolean
    reenviado?: boolean
    funcionario_emisor: string
    funcionario_receptor: string
}

export interface BandejaEntradaModel_View {
    id_tramite: number
    id_cuentaEmisor: number
    detalle: string
    fecha_envio: string
    aceptado: boolean
    alterno: string
    estado: string
    externo: boolean
    titulo: string
    funcionario: string
    cargo: string
}

export interface BandejaSalidaModel_View {
    id_bandeja: number
    id_tramite: number
    id_cuentaEmisor: number
    id_cuentaReceptor: number
    detalle: string
    fecha_envio: string
    fecha_recibido: string | null
    aceptado: boolean | null
    reenviado: boolean
    funcionario_emisor: string
    funcionario_receptor: string
    motivo: string | null
    alterno: string
    estado: string
    cite?: string
    externo: boolean
    titulo: string
    cargo: string
}




export interface UserSocket {
    id?: string
    id_cuenta: number
    funcionario: string
    cargo: string
}

export interface MailModel {
    id_tramite: number
    titulo: string
    alterno: string
    estado: string
    externo: boolean
}



