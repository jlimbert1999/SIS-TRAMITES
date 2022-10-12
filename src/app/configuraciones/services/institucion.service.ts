import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { InstitucionModel } from '../models/institucion.mode';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class InstitucionService {

  constructor(private http: HttpClient) { }

  getInstituciones(desde: number = 0, filas: number = 10) {
    return this.http.get<{ ok: boolean, instituciones: InstitucionModel[], total: number }>(`${base_url}/instituciones?desde=${desde}&filas=${filas}`)
      .pipe(map(resp => {
        return { instituciones: resp.instituciones, total: resp.total }
      }))
  }
  addInstitucion(institucion: InstitucionModel) {
    return this.http.post<{ resp: boolean, institucion: InstitucionModel }>(`${base_url}/instituciones`, institucion)
      .pipe(map(resp => {
        return resp.institucion
      }))
  }
  editInstitucion(id_institucion: number, institucion: InstitucionModel) {
    return this.http.put<{ resp: boolean, cambios: any }>(`${base_url}/instituciones/${id_institucion}`, institucion)
      .pipe(map(resp => {
        return resp.cambios
      }))
  }
  deleteInstictucion(id_institucion: number) {
    return this.http.delete<{ resp: boolean, message: string }>(`${base_url}/instituciones/${id_institucion}`)
      .pipe(map(resp => {
        return resp.message
      }))

  }
  habilitarInstitucin(id_institucion: number) {
    return this.http.put<{ resp: boolean, cambios: any }>(`${base_url}/instituciones/${id_institucion}`, { activo: true })
      .pipe(map(resp => {
        return resp.cambios
      }))
  }
  searchInstitucion(termino: string) {
    return this.http.get<{ resp: boolean, instituciones: InstitucionModel[] }>(`${base_url}/instituciones/busqueda/${termino}`)
    .pipe(map(resp => {
      return resp.instituciones
    }))

  }

}
