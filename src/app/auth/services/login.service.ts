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
  Detalles_Cuenta: { funcionario: string, cargo: string, permiso: string, id_cuenta: number, sigla: string }
  constructor(private http: HttpClient, private router:Router) { }

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
    console.log('Error peticion', error);
    if (error.status == 404) {
      Swal.fire('Solictud incorrecta ', 'No se econtro la ruta solicitada', 'error')
    }
    else {
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
    return this.http.post(`${base_url}/cuentas/login`, formData).pipe(tap(
      (res: any) => {
        localStorage.setItem('token', res.token)
      }
    ))
  }
  validar_token(): Observable<boolean> {
    return this.http.get(`${base_url}/cuentas/validar`).pipe(
      map((resp: any) => {
        this.Detalles_Cuenta = jwt_decode(this.token)
        return true
      }), catchError(err => {
        return of(false)
      })
    )
  }
  get Menu() {
    let Modulos: object[] = []
    if (this.Detalles_Cuenta.permiso == 'admin_role') {
      Modulos = [
        {
          modulo: "Usuarios",
          submodulos: [
            { nombre: 'Funcionarios', ruta: 'usuarios', icon: 'group' },
            { nombre: 'Cuentas', ruta: 'cuentas', icon: 'badge' },
            { nombre: 'Grupo de trabajo', ruta: 'groupware', icon: 'groups' },

          ]
        },
        {
          modulo: "Tramites",
          submodulos: [
            { nombre: 'Tipos de Tramites', ruta: 'tipos', icon: 'summarize' }

          ]
        },
        {
          modulo: "Configuraciones",
          submodulos: [
            { nombre: 'Instituciones', ruta: 'instituciones', icon: 'apartment' },
            { nombre: 'Dependencias', ruta: 'dependencias', icon: 'home_work' },
            { nombre: 'Cargos', ruta: 'cargos', icon: 'assignment_ind' },
            // { nombre: 'Documentos', ruta: 'administrar-tipos-documentos', icon: 'contact_page' }
          ]
        },
        {
          modulo: "Documentos",
          submodulos: [
            { nombre: 'Tipos de documento', ruta: 'documentos', icon: 'apartment' },
          ]
        }


      ]

    }
    else if (this.Detalles_Cuenta.permiso == 'receptionist_role') {
      Modulos = [
        {
          modulo: "Tramites",
          submodulos: [
            { nombre: 'Tramites externos', ruta: 'tramites', icon: 'text_snippet' },
            { nombre: 'Tramites internos', ruta: 'tramites-internos', icon: 'text_snippet' }

          ]
        },
        {
          modulo: "Bandejas",
          submodulos: [
            { nombre: 'Bandeja entrada', ruta: 'bandeja-entrada', icon: 'mark_as_unread' },
            { nombre: 'Bandeja salida', ruta: 'bandeja-salida', icon: 'outgoing_mail' },
          ]
        },
        {
          modulo: "Reportes",
          submodulos: [
            { nombre: 'Reporte ficha', ruta: 'reporte-ficha', icon: 'receipt_long' },
            { nombre: 'Reporte estado', ruta: 'reporte-estado', icon: 'file_present' },
            { nombre: 'Reporte tipo', ruta: 'reporte-tipo', icon: 'format_list_numbered' }
          ]
        }
      ]
    }
    else if (this.Detalles_Cuenta.permiso == 'evaluator_role') {
      Modulos = [
        {
          modulo: "Tramites",
          submodulos: [
            { nombre: 'Tramites internos', ruta: 'tramites-internos', icon: 'text_snippet' }

          ]
        },
        {
          modulo: "Bandejas",
          submodulos: [
            { nombre: 'Bandeja entrada', ruta: 'bandeja-entrada', icon: 'mark_as_unread' },
            { nombre: 'Bandeja salida', ruta: 'bandeja-salida', icon: 'outgoing_mail' },
          ]
        },
        {
          modulo: "Reportes esternos",
          submodulos: [
            { nombre: 'Reporte ficha', ruta: 'reporte-ficha', icon: 'receipt_long' },
            { nombre: 'Reporte estado', ruta: 'reporte-estado', icon: 'file_present' },
            { nombre: 'Reporte tipo', ruta: 'reporte-tipo', icon: 'format_list_numbered' }
          ]
        }
      ]

    }
    return Modulos
  }


}
