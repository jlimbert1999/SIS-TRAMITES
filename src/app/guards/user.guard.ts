import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../auth/services/login.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      const expectedRole = route.data['expectedRole'];
      if (this.loginService.Detalles_Cuenta.permiso !== expectedRole) {
        this.router.navigate(['/home'])
        return false
      }
      return true

  }

}
