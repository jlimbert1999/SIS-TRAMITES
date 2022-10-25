import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, tap, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators'
import Swal from 'sweetalert2'
import jwt_decode from "jwt-decode";
import { Router } from '@angular/router';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  Detalles_Cuenta: {
    funcionario: string,
    id_funcionario: number,
    cargo: string,
    permiso: string,
    id_cuenta: number,
    sigla: string
  }
  Menu:any[]=[]

  constructor(private http: HttpClient, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headers = new HttpHeaders({
      'token': localStorage.getItem('token') || ''
    })
    const reqClone = req.clone({
      headers
    })
    return next.handle(reqClone).pipe(
      catchError(this.manejoErrores)
    )
  }
  get token() {
    return localStorage.getItem('token') || ''
  }

  manejoErrores(error: HttpErrorResponse) {
    console.log('Error peticion', error.status);
    if (error.status == 404) {
      Swal.fire('Solictud incorrecta ', 'No se econtro la ruta solicitada', 'error')
    }
    else if (error.status == 400) {
      this.router.navigate(['/login'])
    }
    else if (error.status == 401) {
      Swal.fire('error', error.error.message, 'error')
    }
    return throwError(() => error);
  }

  login(formData: any, recordar: boolean) {
    if (recordar) {
      localStorage.setItem('login', formData.login)
    }
    else {
      localStorage.removeItem('login')
    }
    return this.http.post<{ ok: boolean, token: string, permiso: string }>(`${base_url}/cuentas/login`, formData).pipe(map(
      res => {
        localStorage.setItem('token', res.token)
        return res.permiso
      }
    ))
  }
  validar_token(): Observable<boolean> {
    return this.http.get<{ ok: boolean, token: string, Menu:any }>(`${base_url}/cuentas/validar`).pipe(
      map(res => {
        this.Detalles_Cuenta = jwt_decode(res.token)
        this.Menu=res.Menu
        localStorage.setItem('token', res.token)
        return true
      }), catchError(err => {
        return of(false)
      })
    )
  }
  


}
