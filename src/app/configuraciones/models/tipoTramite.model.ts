export interface TipoTramiteModel {
    id_TipoTramite?: number
    titulo: string
    sigla: string
    segmento: string
    activo?: boolean,
    externo: boolean
}

export interface RequerimientosModel {
    id_requerimiento?: number,
    tipo_documento: number,
    detalle: string,
    activo: boolean,
    id_TipoTramite?: number
}
