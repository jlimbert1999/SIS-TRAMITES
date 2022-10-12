import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { RequerimientosModel, TipoTramiteModel } from '../models/tipoTramite.model';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class TiposTramitesService {

  constructor(private http: HttpClient) { }

  getRequerimientos_Habilitados(id_TipoTramite: number) {
    return this.http.get(`${base_url}/api/requerimientos_Habilitados/${id_TipoTramite}`)
  }
  // NUEVOS
  getTipos(desde: number, filas: number = 10) {
    return this.http.get<{ resp: boolean, tipos: TipoTramiteModel[], segmentos: { segmento: string }[], total: number }>(`${base_url}/tipos?desde=${desde}&filas=${filas}`)
      .pipe(map(resp => {
        return { tipos: resp.tipos, segmentos: resp.segmentos, total: resp.total }
      }))
  }
  addTipo(tipo_tramite: TipoTramiteModel, requisitos: RequerimientosModel[]) {
    return this.http.post(`${base_url}/tipos`, { tipo_tramite, requisitos })
  }
  putTipo(id_TipoTramite: number, tipo_tramite: any) {
    return this.http.put(`${base_url}/tipos/${id_TipoTramite}`, tipo_tramite)
  }

  getClasificacion_Requisitos() {
    return this.http.get(`${base_url}/tipos/requisitos/clasificacion`)
  }

  addRequerimiento(requerimiento: RequerimientosModel) {
    return this.http.post(`${base_url}/tipos/requerimiento`, requerimiento)
  }

  getRequerimientos(id_TipoTramite: number) {
    return this.http.get(`${base_url}/tipos/requerimientos?tipo_tramite=${id_TipoTramite}`)
  }
  putRequerimientos(id_requerimiento: number, requerimiento: any) {
    return this.http.put(`${base_url}/tipos/requerimiento/${id_requerimiento}`, requerimiento)
  }

  searchTiposTramites(termino:string) {
    return this.http.get<{ ok: boolean, tipos: TipoTramiteModel[]}>(`${base_url}/tipos/busqueda/${termino}`)
      .pipe(map(resp => {
        return resp.tipos
      }))
  }
}
