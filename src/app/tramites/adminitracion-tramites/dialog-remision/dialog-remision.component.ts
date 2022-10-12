import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { LoginService } from 'src/app/auth/services/login.service';
import { SocketService } from 'src/app/auth/services/socket.service';
import { ConfiguracionesService } from 'src/app/configuraciones/services/configuraciones.service';
import { BandejaService } from '../../services/bandeja.service';
import Swal from 'sweetalert2';
import { BandejaEntradaModel, BandejaEntradaModel_View, BandejaSalidaModel, BandejaSalidaModel_View, UserSocket } from '../../models/mail.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog-remision',
  templateUrl: './dialog-remision.component.html',
  styleUrls: ['./dialog-remision.component.css']
})
export class DialogRemisionComponent implements OnInit {
  Instituciones: { id_institucion: number, nombre: string, sigla: string }[];
  Dependencias: { id_dependencia: number, nombre: string }[];
  Bandeja_entrada: BandejaEntradaModel;
  Bandeja_salida: BandejaSalidaModel;
  Funcionario_Receptor: UserSocket
  users_socket: UserSocket[];

  Usuarios: any[] = []
  filteredStates: Observable<any[]>;
  stateCtrl = new FormControl();


  @ViewChild('txt_UserRecep') inputUserRecep: any;

  constructor(
    private configuracionesService: ConfiguracionesService,
    private bandejaService: BandejaService,
    private socketService: SocketService,
    private loginService: LoginService,
    private dialogRef: MatDialogRef<DialogRemisionComponent>,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data:
      {
        id_tramite: number
        titulo: string
        alterno: string
        estado: string
        externo: boolean

        mensaje: string
      }
  ) { }

  private _filterStates(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.Usuarios.filter(state => state.funcionario.toLowerCase().includes(filterValue) || state.cargo.toLowerCase().includes(filterValue));
  }

  ngOnInit(): void {
    this.socketService.Emitir('usuarios', null).subscribe((users: any) => {
      this.users_socket = users
    })
    this.configuracionesService.getInstituciones_Habilitadas().subscribe(ints => {
      this.Instituciones = ints
    })
  }
  obtener_DependenciasInst(id_institucion: number) {
    this.configuracionesService.getIDepedencias_habilitadas_deInstitucion(id_institucion).subscribe(dep => {
      this.Dependencias = dep
    })
  }


  obtener_usuarios_envio(id_dependencia: number) {
    this.inputUserRecep.nativeElement.value = '';
    this.Usuarios = []
    this.bandejaService.obtener_usuarios_envio(id_dependencia).subscribe(funcionarios => {
      funcionarios.forEach(funcionario => {
        if (funcionario.id_cuenta != this.loginService.Detalles_Cuenta.id_cuenta) {
          let user = this.users_socket.find(user => user.id_cuenta == funcionario.id_cuenta)
          if (user) {
            funcionario.id = user.id
          }
          this.Usuarios.push(funcionario)
        }
      })
      this.filteredStates = this.stateCtrl.valueChanges.pipe(
        startWith(''),
        map(state => (state ? this._filterStates(state) : this.Usuarios.slice())),
      );
    })
  }

  Enviar_Tramite() {
    Swal.fire({
      title: `Remitir tramite?`,
      text: `Se enviara a ${this.Funcionario_Receptor.funcionario} (${this.Funcionario_Receptor.cargo})`,
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#38B000',
      cancelButtonColor: '#F94144',
      icon: 'question'
    }).then((result) => {
      if (result.isConfirmed) {
        this.Bandeja_entrada = {
          id_tramite: this.data.id_tramite,
          id_cuentaEmisor: this.loginService.Detalles_Cuenta.id_cuenta,
          id_cuentaReceptor: this.Funcionario_Receptor.id_cuenta,
          detalle: this.data.mensaje
        }
        this.Bandeja_salida = {
          id_tramite: this.data.id_tramite,
          id_cuentaEmisor: this.loginService.Detalles_Cuenta.id_cuenta,
          id_cuentaReceptor: this.Funcionario_Receptor.id_cuenta,
          detalle: this.data.mensaje,
          funcionario_emisor: this.loginService.Detalles_Cuenta.funcionario,
          funcionario_receptor: this.Funcionario_Receptor.funcionario
        }
        Swal.fire({
          title: 'Enviando tramite....',
          text: 'Espere a que el envio se complete',
          icon: 'info',
          allowOutsideClick: false
        })
        Swal.showLoading();

        this.bandejaService.addbandejas(this.Bandeja_entrada, this.Bandeja_salida, this.data.estado).subscribe(fecha_envio => {
          if (this.data.estado == 'Inscrito') {
            this.data.estado = "En revision"
          }
          if (this.Funcionario_Receptor.id) {
            //envio en tiempo real
            let mail: BandejaEntradaModel_View = {
              id_tramite: this.data.id_tramite,
              alterno: this.data.alterno,
              detalle: this.data.mensaje,
              estado: this.data.estado,
              externo: this.data.externo,
              id_cuentaEmisor: this.loginService.Detalles_Cuenta.id_cuenta,
              funcionario: this.loginService.Detalles_Cuenta.funcionario,
              cargo: this.loginService.Detalles_Cuenta.cargo,
              titulo: this.data.titulo,
              aceptado: false,
              fecha_envio
            }
            this.socketService.Emitir('enviar_tramite', { id: this.Funcionario_Receptor.id, tramite: mail }).subscribe()

          }
          Swal.close()
          this.toastr.success(undefined, 'Tramite enviado', {
            positionClass: 'toast-bottom-right',
            timeOut: 5000,
          })
          //regresar data para bandeja salida
          const row_table_bandejaSalida: BandejaSalidaModel_View = {
            id_bandeja: 0,
            id_tramite: this.data.id_tramite,
            id_cuentaEmisor: this.loginService.Detalles_Cuenta.id_cuenta,
            id_cuentaReceptor: this.Funcionario_Receptor.id_cuenta,
            detalle: this.data.mensaje,
            fecha_envio: fecha_envio,
            fecha_recibido: null,
            aceptado: null,
            reenviado: false,
            funcionario_emisor: this.loginService.Detalles_Cuenta.funcionario,
            funcionario_receptor: this.Funcionario_Receptor.funcionario,
            motivo: null,
            alterno: this.data.alterno,
            estado: this.data.estado,
            externo: this.data.externo,
            titulo: this.data.titulo,
            cargo: this.Funcionario_Receptor.cargo
          }
          this.dialogRef.close(row_table_bandejaSalida);
        })
      }
    })
  }

}
