import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
const url = environment.base_url


@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  constructor(private http: HttpClient) { }

  reporte_ficha(alterno: string) {
    return this.http.get(`${url}/reporte/ficha/${alterno}`).pipe(map((resp: any) => {
      if (resp.ok) {
        return resp.reporte
      }
    }))
  }
  reporte_estado(estado: string, desde: number, hasta: number, externo: string) {
    return this.http.get(`${url}/reporte/estados?estado=${estado}&desde=${desde}&hasta=${hasta}&externo=${externo}`).pipe(map((resp: any) => {
      if (resp.ok) {
        console.log(resp);
        return resp.reporte
      }
    }))
  }
  reporte_tipo(id_TipoTramite: any, desde: number, hasta: number, externo: number) {
    return this.http.get(`${url}/reporte/tipos?tipo=${id_TipoTramite}&desde=${desde}&hasta=${hasta}&externo=${externo}`).pipe(map((resp: any) => {
      if (resp.ok) {
        return resp.reporte
      }
    }))
  }
}
