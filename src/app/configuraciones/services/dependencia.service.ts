import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DependenciaModel, DependenciaModel_View } from '../models/dependencia.model';
const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class DependenciaService {

  constructor(private http: HttpClient) { }

  getDependencias(desde: number = 0, filas: number = 10) {
    return this.http.get<{ ok: boolean, dependencias: DependenciaModel_View[], total: number }>(`${base_url}/dependencias?desde=${desde}&filas=${filas}`)
      .pipe(map(resp => {
        return { dependencias: resp.dependencias, total: resp.total }
      }))
  }

  addDependencia(dependencia: DependenciaModel) {
    return this.http.post<{ resp: boolean, dependencia: DependenciaModel }>(`${base_url}/dependencias`, dependencia)
      .pipe(map(resp => {
        return resp.dependencia
      }))
  }
  editDependencia(id_dependencia: number, data: { nombre: string, sigla: string }) {
    return this.http.put<{ resp: boolean, cambios: any }>(`${base_url}/dependencias/${id_dependencia}`, data)
      .pipe(map(resp => {
        return resp.cambios
      }))
  }
  deleteDependencia(id_dependencia: number) {
    return this.http.put<{ resp: boolean, cambios: any }>(`${base_url}/dependencias/${id_dependencia}`, { activo: false })
      .pipe(map(resp => {
        return resp.cambios
      }))
  }
  habilitarDependencia(id_dependencia: number) {
    return this.http.put<{ resp: boolean, cambios: any }>(`${base_url}/dependencias/${id_dependencia}`, { activo: true })
      .pipe(map(resp => {
        return resp.cambios
      }))
  }

  searchDepenedencias(termino: string) {
    return this.http.get<{ resp: boolean, dependencias: DependenciaModel_View[] }>(`${base_url}/dependencias/busqueda/${termino}`)
      .pipe(map(resp => {
        return resp.dependencias
      }))
  }

  getInstituciones_Habilitadas() {
    return this.http.get<{ ok: boolean, instituciones: { id_institucion: number, nombre: string, sigla: string }[] }>(`${base_url}/instituciones-shared`)
    .pipe(map(resp => {
      return resp.instituciones
    }))
  }


}
