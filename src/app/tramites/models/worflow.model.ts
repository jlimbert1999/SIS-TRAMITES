export interface WorkflowModel {
    id_cuentaEmisor: number
    id_cuentaReceptor: number
    detalle: string
    fecha_envio: string
    fecha_recibido: string
    aceptado: boolean
    funcionario_emisor: string
    funcionario_receptor: string
    motivo: string
}

export interface ParticipantesWorkflowModel {
    Funcionario?:string
    id_cuenta: number
    NombreCar: string
    NombreDep:string
    NombreInst:string
    sigla:string
}

