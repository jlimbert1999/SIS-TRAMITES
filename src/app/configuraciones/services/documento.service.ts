import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DocumentoModel } from '../models/documento.mode';

const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class DocumentoService {

  constructor(private http: HttpClient) { }

  getDocumentos() {
    return this.http.get<{ ok: boolean, documentos: DocumentoModel[] }>(`${base_url}/documentos`)
      .pipe(map(resp => {
        return resp.documentos
      }))
  }
  addDocumento(documento: DocumentoModel) {
    return this.http.post<{ ok: boolean, documento: DocumentoModel }>(`${base_url}/documentos`, documento)
      .pipe(map(resp => {
        return resp.documento
      }))

  }

  updateDocumento(id_documento: number, documento: any) {
    return this.http.put<{ ok: boolean, cambios: any, message: string }>(`${base_url}/documentos/${id_documento}`, documento)
      .pipe(map(resp => {
        return resp.cambios
      }))
  }
}
