import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { LoginService } from '../auth/services/login.service';
import { Router } from '@angular/router';
import { SocketService } from '../auth/services/socket.service';
import { ToastrService } from 'ngx-toastr';
import { fadeInOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations:[
    fadeInOnEnterAnimation()
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  Cuenta: any = this.loginService.Detalles_Cuenta
  Menu: any
  audio = new Audio();

  mobileQuery: MediaQueryList;
  fillerNav = Array.from({ length: 50 }, (_, i) => `Nav Item ${i + 1}`);
  private _mobileQueryListener: () => void;


  constructor(
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private loginService: LoginService, private router: Router,
    private socketService: SocketService, private toastr: ToastrService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.audio.src = "../../../assets/sounds/Notification.mp3";
    this.audio.load();
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }



  ngOnInit(): void {
    this.Menu = this.loginService.Menu
    this.unirse_Groupware()
  }
  cerrar_sesion() {
    localStorage.removeItem('token');
    this.router.navigate(['login'])

  }

  unirse_Groupware() {
    if (this.Cuenta) {
      let usuario = {
        id_cuenta: this.Cuenta.id_cuenta,
        funcionario: this.Cuenta.funcionario,
        cargo: this.Cuenta.cargo
      }
      this.socketService.Emitir('unirse', usuario).subscribe((resp: any) => {
        this.socketService.Escuchar('recibir_tramite').subscribe((mail: any) => {
          this.toastr.info(`${mail.funcionario} ha enviado un tramite`, 'Nuevo tramite recibido', {
            positionClass: 'toast-bottom-right',
            timeOut: 10000,
            tapToDismiss: true
          }).onTap.subscribe(x => {
            this.router.navigate(['home/bandeja-entrada'])
          });
          this.audio.play()
        })
        if (resp.ok == false) {
          console.error(resp.message);
        }
      })
    }
  }
  configurar_perfil(){
    this.router.navigate(['home/perfil'])
  }

}
