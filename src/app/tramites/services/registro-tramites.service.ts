import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { Tramite_Model, TramiteModel_View, TramiteFichaModel, TramiteInternoModel_View, ObservacionModel, ObservacionModel_View } from '../models/tramite.model';
const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class RegistroTramitesService {
  public paginacion = 0
  constructor(private http: HttpClient) { }
  addTramite(solicitud: { tramite: Tramite_Model, solicitante: any, representante: any, interno: any }) {
    return this.http.post(`${base_url}/tramite`, solicitud)
  }
  getTramite(id_tramite: number) {
    return this.http.get<{ ok: boolean }>(`${base_url}/tramite/${id_tramite}`).pipe(map((resp: any) => {
      if (resp.ok) {
        return resp.tramite
      }
    }))
  }
  getTramites(desde: number = 0, filas: number = 10) {  //tramites registrados por esta cuenta
    return this.http.get<{ ok: boolean, tramites: TramiteModel_View[], total: number }>(`${base_url}/tramites?desde=${desde}&filas=${filas}`).pipe(map(resp => {
      resp.tramites.map(tramite => {
        if (tramite.tipo_solicitante == 'NATURAL') {

          tramite['solicitante'] = `${tramite.nombre} ${tramite.apellido_p} ${tramite.apellido_m || ''}`
        }
        else {
          tramite['solicitante'] = `${tramite.nombre}`;
        }
      })
      return { tramites: resp.tramites, total: resp.total }
    }))
  }
  getSolictidud(id_solicitante: any, id_representante: any, id_interno: any) { //otbener detalles del solcitnate
    return this.http.get(`${base_url}/solicitante?id_solicitante=${id_solicitante}&id_representante=${id_representante}&id_interno=${id_interno}`).pipe(map((resp: any) => {
      if (resp.ok) {
        return resp.solicitud
      }

    }))
  }
  putSolicitud(solicitante: any, representante: any, tramite: any, interno: any) {
    return this.http.put(`${base_url}/tramite`, { solicitante, representante, tramite, interno }).pipe(map((resp: any) => {
      if (resp.ok) {
        return resp.tramite
      }

    }))
  }

  getTipos_Tramites(externos: boolean) {
    //traer tramites para el registro
    if (externos) {
      return this.http.get<{ ok: boolean, tipos: { id_TipoTramite: number, segmento: string, sigla: string, titulo: string }[] }>(`${base_url}/tipos-tramites/solicitud?externos=1`).pipe(
        map(resp => resp.tipos)
      )
    }
    else {
      return this.http.get<{ ok: boolean, tipos: { id_TipoTramite: number, segmento: string, sigla: string, titulo: string }[] }>(`${base_url}/tipos-tramites/solicitud?externos=0`).pipe(
        map(resp => resp.tipos)
      )
    }

  }
  getTipos_Documentos() {
    return this.http.get(`${base_url}/api/solicitante-documento`)
  }


  //observaciones
  addObservacion(datos: any, estado: string) {
    return this.http.post<{ oK: boolean, observacion: ObservacionModel }>(`${base_url}/observacion`, { observacion: datos, estado }).pipe(
      map(resp => resp.observacion)
    )
  }
  getObservaciones(id_tramite: number) {
    return this.http.get<{ oK: boolean, observaciones: ObservacionModel_View[] }>(`${base_url}/observacion/${id_tramite}`).pipe(map(resp => resp.observaciones))
  }


  putObservacion(id_observacion: number, id_tramite: number) {
    return this.http.put<{ ok: boolean, estado: string | null }>(`${base_url}/observacion/${id_observacion}`, { id_tramite }).pipe(
      map(resp => resp.estado)
    )
  }


  // MANEJO DE TRAMITES INTERENOS
  getTramites_internos() {
    return this.http.get<{ ok: boolean, Tramites: TramiteInternoModel_View[], total: number }>(`${base_url}/tramites/internos`).pipe(map(resp => {
      return { Tramites: resp.Tramites, total: resp.total }
    }))
  }
  getInterno(id_interno: number) {
    return this.http.get(`${base_url}/interno/${id_interno}`)
  }

  buscar_tramite(termino: string) {
    return this.http.get<{ ok: boolean, tramites: TramiteModel_View[] }>(`${base_url}/tramite/busqueda/${termino}`)
      .pipe(map(resp => {
        resp.tramites.map(tramite => {
          if (tramite.tipo_solicitante == 'NATURAL') {

            tramite['solicitante'] = `${tramite.nombre} ${tramite.apellido_p} ${tramite.apellido_m || ''}`
          }
          else {
            tramite['solicitante'] = `${tramite.nombre}`;
          }
        })
        return resp.tramites
      }))
  }
  obtener_hoja_ruta(id_tramite: number, tipo: 'interno' | 'externo') {
    return this.http.get<{ ok: boolean, tramite: any, fecha_generacion: string }>(`${base_url}/tramite/hoja-ruta/${id_tramite}?tipo=${tipo}`).pipe(map(resp => {
      return { tramite: resp.tramite, fecha_generacion: resp.fecha_generacion }
    }))
  }



  getInfoFicha(id_tramite: number) {
    return this.http.get<{ ok: boolean, tramite: TramiteFichaModel, requerimientos: { detalle: string }[] }>(`${base_url}/tramite/${id_tramite}`).pipe(map(resp => {
      return { tramite: resp.tramite, requerimientos: resp.requerimientos }
    }))

  }

}
