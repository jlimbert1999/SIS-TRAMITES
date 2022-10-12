export interface DependenciaModel {
    id_dependencia?: number
    nombre: string
    sigla: string
    id_institucion: number
    activo?: boolean
}

export interface DependenciaModel_View {
    id_dependencia: number
    nombre: string
    sigla: string
    activo: boolean
    id_institucion: number
    institucion_sigla: string
}

