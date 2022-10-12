import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class RegistroTramitesInternosService {

  constructor(private http: HttpClient) { }

  
}
