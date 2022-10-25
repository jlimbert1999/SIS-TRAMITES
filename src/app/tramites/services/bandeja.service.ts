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
  pageIndex_mailOut: number = 0
  rows_mailOut: number = 10
  modo_busqueda_mailOut: boolean = false
  termino_busqueda_mailOut: string = ""

  pageIndex_mailIn: number = 0
  rows_mailIn: number = 10
  modo_busqueda_mailIn: boolean = false
  termino_busqueda_mailIn: string = ""

  dataSize: number

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
  getBandejaSalida() {
    return this.http.get<{ ok: boolean, bandeja: BandejaSalidaModel_View[], total: number }>(`${base_url}/mail/salida?pageIndex=${this.pageIndex_mailOut}&rows=${this.rows_mailOut}`).pipe(
      map(data => {
        this.dataSize = data.total
        return data.bandeja
      })
    )
  }
  searchBandejaSalida() {
    return this.http.get<{ ok: boolean, bandeja: BandejaSalidaModel_View[], total: number }>(`${base_url}/mail/salida/${this.termino_busqueda_mailOut}?pageIndex=${this.pageIndex_mailOut}&rows=${this.rows_mailOut}`).pipe(
      map(data => {
        this.dataSize = data.total
        return data.bandeja
      })
    )
  }
  getBandejaEntrada() {
    return this.http.get<{ ok: boolean, bandeja: BandejaEntradaModel_View[], total: number }>(`${base_url}/mail/entrada?pageIndex=${this.pageIndex_mailIn}&rows=${this.rows_mailIn}`).pipe(
      map(data => {
        this.dataSize = data.total
        return data.bandeja
      })
    )
  }
  searchBandejaEntrada() {
    return this.http.get<{ ok: boolean, bandeja: BandejaEntradaModel_View[], total: number }>(`${base_url}/mail/entrada/${this.termino_busqueda_mailIn}?pageIndex=${this.pageIndex_mailIn}&rows=${this.rows_mailIn}`).pipe(
      map(data => {
        this.dataSize = data.total
        return data.bandeja
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
