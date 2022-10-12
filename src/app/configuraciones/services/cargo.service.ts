import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { CargoModel } from '../models/cargo.model';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class CargoService {

  constructor(private http: HttpClient) { }

  getCargos(desde: number = 0, filas: number = 10) {
    return this.http.get<{ ok: boolean, cargos: CargoModel[], total: number }>(`${base_url}/cargos?desde=${desde}&filas=${filas}`)
      .pipe(map(resp => {
        return { cargos: resp.cargos, total: resp.total }

      }))
  }
  searchCargos(termino: string) {
    return this.http.get<{ resp: boolean, cargos: CargoModel[] }>(`${base_url}/cargos/busqueda/${termino}`)
      .pipe(map(resp => {
        return resp.cargos
      }))
  }
  addCargo(cargo: CargoModel) {
    return this.http.post<{ resp: boolean, cargo: CargoModel }>(`${base_url}/cargos`, cargo)
      .pipe(map(resp => {
        return resp.cargo
      }))
  }
  editCargo(id_cargo: number, cargo: CargoModel) {
    return this.http.put<{ resp: boolean, cambios: any }>(`${base_url}/cargos/${id_cargo}`, cargo)
      .pipe(map(resp => {
        return resp.cambios
      }))
  }
  deleteCargo(id_cargo: number) {
    return this.http.delete<{ resp: boolean, message: string }>(`${base_url}/cargos/${id_cargo}`)
      .pipe(map(resp => {
        return resp.message
      }))

  }
  habilitarCargo(id_cargo: number) {
    return this.http.put<{ resp: boolean, cambios: string }>(`${base_url}/cargos/${id_cargo}`, { activo: true })
      .pipe(map(resp => {
        return resp.cambios
      }))

  }

}
