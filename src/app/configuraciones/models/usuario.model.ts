export interface UsuarioModel_View {
    id_funcionario?: number
    nombre: string
    apellido_p: string
    apellido_m: string
    telefono: number,
    dni: number
    expedido: number
    direccion: string
    activo: boolean
    id_cuenta: number
}


export class UsuarioModel {
    constructor(
        public nombre: string,
        public apellido_p: string,
        public apellido_m: string,
        public dni: number,
        public telefono: number,
        public direccion: string,
        public expedido: number,
        public id_funcionario?: number,
        public activo?: true | false,
    ) {
    }
    get nombre_completo() {
        if (this.apellido_m == '' || this.apellido_m == undefined) {
            return `${this.nombre} ${this.apellido_p}`
        }
        return `${this.nombre} ${this.apellido_p} ${this.apellido_m}`

    }
    get expedido_lugar() {
        let lugar: string = "Desconocido"
        if (this.expedido == 1) {
            lugar = `Cochabamba`
        }
        if (this.expedido == 2) {
            lugar = `Chuquisaca`
        }
        if (this.expedido == 3) {
            lugar = `La Paz`
        }
        if (this.expedido == 4) {
            lugar = `Oruro`
        }
        if (this.expedido == 5) {
            lugar = `Potosí`
        }
        if (this.expedido == 6) {
            lugar = `Tarija`
        }
        if (this.expedido == 7) {
            lugar = `Santa Cruz`
        }
        if (this.expedido == 8) {
            lugar = `Beni`
        }
        if (this.expedido == 9) {
            lugar = `Pando`
        }
        return lugar

    }

}

export interface CuentaModel {
    id_cuenta?: number
    id_cargo: number
    id_funcionario: number
    login: string
    password: string
    permisos: number
    id_dependencia: number
    activo?: boolean
}
export interface CuentaModel_View {
    id_cuenta: number
    id_funcionario: number
    login: string
    activo: boolean
    funcionario: string | null
    permisos: number
    dni: number | null
    cargo: string
    rol: string
    dependencia: string,
    sigla_institucion: string
}

export interface perfilModel {
    cargo: string
    dependencia: string
    dni: number
    funcionario: string
    id_cuenta: number
    institucion: string
    login: string
    telefono: number,
    direccion:string
}
