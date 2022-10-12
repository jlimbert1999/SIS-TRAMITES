import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CuentaModel, CuentaModel_View, UsuarioModel } from '../models/usuario.model';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class ConfiguracionesService {

  expedido = [
    {
      id_expedido: 1,
      nombre: `Cochabamba`
    },
    {
      id_expedido: 2,
      nombre: `Chuquisaca`
    },
    {
      id_expedido: 3,
      nombre: `La Paz`
    },
    {
      id_expedido: 4,
      nombre: `Oruro`
    },
    {
      id_expedido: 5,
      nombre: `Potosí`
    },
    {
      id_expedido: 6,
      nombre: `Tarija`
    },
    {
      id_expedido: 7,
      nombre: `Santa Cruz`
    }
    , {
      id_expedido: 8,
      nombre: `Beni`
    }
    , {
      id_expedido: 9,
      nombre: `Pando`
    }
  ]

  constructor(private http: HttpClient) { }


  //Funcionaioes
  getFuncionarios(desde: number = 0, filas: number = 10) {
    return this.http.get<{ resp: boolean, funcionarios: UsuarioModel[], total: number }>(`${base_url}/funcionarios?desde=${desde}&filas=${filas}`)
      .pipe(map(resp => {
        const funcionarios = resp.funcionarios.map(
          (funcionario: UsuarioModel) =>
            new UsuarioModel(funcionario.nombre, funcionario.apellido_p, funcionario.apellido_m, funcionario.dni, funcionario.telefono, funcionario.direccion, funcionario.expedido, funcionario.id_funcionario, funcionario.activo)
        )
        return { funcionarios, total: resp.total }
      }))
  }
  addFuncionario_Cuenta(funcionario: UsuarioModel, cuenta: CuentaModel | null) {
    return this.http.post<{ ok: boolean, funcionario: UsuarioModel, cuenta?: CuentaModel, message: string }>(`${base_url}/funcionarios/cuentas`, { funcionario, cuenta })
      .pipe(map(resp => {
        let data
        if (cuenta) {
          data = {
            funcionario: new UsuarioModel(resp.funcionario.nombre, resp.funcionario.apellido_p, resp.funcionario.apellido_m, resp.funcionario.dni, resp.funcionario.telefono, resp.funcionario.direccion, resp.funcionario.expedido, resp.funcionario.id_funcionario, resp.funcionario.activo),
            cuenta: resp.cuenta
          }
        }
        else {
          data = {
            funcionario: new UsuarioModel(resp.funcionario.nombre, resp.funcionario.apellido_p, resp.funcionario.apellido_m, resp.funcionario.dni, resp.funcionario.telefono, resp.funcionario.direccion, resp.funcionario.expedido, resp.funcionario.id_funcionario, resp.funcionario.activo),
            cuenta: null
          }
        }
        return data
      }))
  }

  editFuncionario(id_funcionario: number, data: UsuarioModel) {
    return this.http.put<{ resp: boolean, cambios: any }>(`${base_url}/funcionarios/${id_funcionario}`, data)
      .pipe(map(resp => {
        return resp.cambios
      }))
  }
  deleteFuncionario(id_funcionario: number) {
    return this.http.delete<{ resp: boolean, message: string }>(`${base_url}/funcionarios/${id_funcionario}`)
      .pipe(map(resp => {
        return resp.message
      }))
  }

  searchFuncionarios(termino: string) {
    return this.http.get<{ resp: boolean, funcionarios: UsuarioModel[] }>(`${base_url}/funcionarios/busqueda/${termino}`)
      .pipe(map(resp => {
        const funcionarios = resp.funcionarios.map(
          (funcionario: UsuarioModel) =>
            new UsuarioModel(funcionario.nombre, funcionario.apellido_p, funcionario.apellido_m, funcionario.dni, funcionario.telefono, funcionario.direccion, funcionario.expedido, funcionario.id_funcionario, funcionario.activo)

        )
        return funcionarios
      }))
  }

  searchFuncionarios_NoAsignados(termino: string) {
    return this.http.get<{ resp: boolean, funcionarios: UsuarioModel[] }>(`${base_url}/funcionarios/no-asignados/busqueda/${termino}`)
      .pipe(map(resp => {
        const funcionarios = resp.funcionarios.map(
          (funcionario: UsuarioModel) =>
            new UsuarioModel(funcionario.nombre, funcionario.apellido_p, funcionario.apellido_m, funcionario.dni, funcionario.telefono, funcionario.direccion, funcionario.expedido, funcionario.id_funcionario, funcionario.activo)
        )
        return funcionarios
      }))
  }

  getMovilidad_Funcional(id_funcionario: number) {
    return this.http.get<{ resp: boolean, detalles: { descripcion: string, fecha: string, funcionario: string, cargo: string }[] }>(`${base_url}/funcionarios/movilidad/${id_funcionario}`)
      .pipe(map(resp => {
        return resp.detalles
      }))
  }


  //cuentas
  getCuentas(desde: number = 0, filas: number = 10, asignadas: 1 | 0) {
    return this.http.get<{ resp: boolean, cuentas: CuentaModel_View[], total: number }>(`${base_url}/cuentass?desde=${desde}&filas=${filas}&asignadas=${asignadas}`)
      .pipe(map(resp => {
        return { cuentas: resp.cuentas, total: resp.total }
      }))
  }
  putCuenta(id_cuenta: number, data: { login: string, password: string, permisos: number }) {
    return this.http.put<{ resp: boolean, cambios: any }>(`${base_url}/cuentas/${id_cuenta}`, data)
      .pipe(map(resp => {
        return resp.cambios
      }))
  }
  searchCuentas(termino: string, tipos: 1 | 0) {
    return this.http.get<{ resp: boolean, cuentas: CuentaModel_View[] }>(`${base_url}/cuentass/${termino}?tipos=${tipos}`)
      .pipe(map(resp => {
        return resp.cuentas
      }))
  }

  getFuncionarios_Asignacion(desde: number = 0, filas: number = 10) {
    return this.http.get<{ resp: boolean, funcionarios: UsuarioModel[], total: number }>(`${base_url}/funcionarios_asignacion-shared?desde=${desde}&filas=${filas}`)
      .pipe(map(resp => {
        const funcionarios = resp.funcionarios.map(
          (funcionario: UsuarioModel) =>
            new UsuarioModel(funcionario.nombre, funcionario.apellido_p, funcionario.apellido_m, funcionario.dni, funcionario.telefono, funcionario.direccion, funcionario.expedido, funcionario.id_funcionario, funcionario.activo)
        )
        return { funcionarios, total: resp.total }
      }))
  }

  asignar_cuenta(id_cuenta: number, id_funcionario: number) {
    return this.http.put<{ resp: boolean, cuenta: any }>(`${base_url}/cuentas/asignar/${id_cuenta}`, { id_funcionario })
      .pipe(map(resp => {
        return resp.cuenta
      }))
  }
  desvincular_cuenta(id_cuenta: number) {
    return this.http.put<{ resp: boolean, message: string }>(`${base_url}/cuentas/desvincular/${id_cuenta}`, {})
      .pipe(map(resp => {
        return resp.message
      }))
  }



  //METODOS COMPARTIDOS
  getCargos_Habilitados() {
    return this.http.get<{ resp: boolean, cargos: { id_cargo: number, nombre: string }[] }>(`${base_url}/cargos-shared`)
      .pipe(map(resp => {
        return resp.cargos
      }))
  }

  //metodos compartidos
  getInstituciones_Habilitadas() {
    return this.http.get<{ ok: boolean, instituciones: { id_institucion: number, nombre: string, sigla: string }[] }>(`${base_url}/instituciones-shared`)
      .pipe(map(resp => {
        return resp.instituciones
      }))
  }
  getIDepedencias_habilitadas_deInstitucion(id_institucion: number) {
    return this.http.get<{ ok: boolean, dependencias: { id_dependencia: number, nombre: string }[] }>(`${base_url}/dependencias-shared/${id_institucion}`)
      .pipe(map(resp => {
        return resp.dependencias
      }))
  }
}
