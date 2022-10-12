import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BandejaEntradaModel, BandejaEntradaModel_View, BandejaSalidaModel, BandejaSalidaModel_View } from '../models/mail.model';


const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class BandejaService {

  constructor(private http: HttpClient) { }
  obtener_usuarios_envio(id_dependencia: number) {
    return this.http.get<{ ok: boolean, funcionarios: { id_cuenta: number, funcionario: string, cargo: string, id?: string }[] }>(`${base_url}/mail/usuarios/${id_dependencia}`).pipe(
      map(resp => {
        return resp.funcionarios
      })
    )
  }
  addbandejas(Bandeja_entrada: BandejaEntradaModel, Bandeja_Salida: BandejaSalidaModel, estado: string) {
    return this.http.post<{ ok: boolean, fecha_envio: string }>(`${base_url}/mail`, { bandeja_entrada: Bandeja_entrada, bandeja_salida: Bandeja_Salida, estado }).pipe(map(resp => {
      return resp.fecha_envio
    }))
  }
  getBandejaSalida(desde: number = 0, filas: number = 10) {
    return this.http.get<{ ok: boolean, bandeja: BandejaSalidaModel_View[], total: number }>(`${base_url}/mail/salida?desde=${desde}&filas=${filas}`).pipe(
      map(data => {
        return { bandeja: data.bandeja, total: data.total }
      })
    )
  }
  getBandejaEntrada(desde: number = 0, filas: number = 10) {
    return this.http.get<{ ok: boolean, bandeja: BandejaEntradaModel_View[], total: number }>(`${base_url}/mail/entrada?desde=${desde}&filas=${filas}`).pipe(
      map(data => {
        return { bandeja: data.bandeja, total: data.total }
      })
    )

  }
  aceptar_Tramite(id_tramite: number, id_cuentaEmisor: number) {
    return this.http.post<{ ok: boolean, message: string }>(`${base_url}/mail/aceptar`, { id_tramite, id_cuentaEmisor }).pipe(
      map(resp => resp.message)
    )
  }
  rechazar_Tramite(id_tramite: number, id_cuentaEmisor: number, id_cuentaReceptor: number, motivo: string) {
    return this.http.post(`${base_url}/mail/rechazar`, { id_tramite, id_cuentaEmisor, id_cuentaReceptor, motivo })
  }
  getDetallesEnvio(id_tramite: number, id_cuenta: number) {
    return this.http.get(`${base_url}/mail/detalles?id_tramite=${id_tramite}&id_cuenta=${id_cuenta}`)
  }


}
