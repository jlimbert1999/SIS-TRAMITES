import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { LoginService } from 'src/app/auth/services/login.service';
import { SocketService } from 'src/app/auth/services/socket.service';
import { BandejaService } from '../services/bandeja.service';
import { WorkflowService } from '../services/workflow.service';
import Swal from 'sweetalert2';
import { DialogRemisionComponent } from '../adminitracion-tramites/dialog-remision/dialog-remision.component';
import { MatDialog } from '@angular/material/dialog';
import { BandejaEntradaModel_View, MailModel } from '../models/mail.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ToastrService } from 'ngx-toastr';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { RegistroTramitesService } from '../services/registro-tramites.service';

@Component({
  selector: 'app-bandeja-entrada',
  templateUrl: './bandeja-entrada.component.html',
  styleUrls: ['./bandeja-entrada.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    fadeInOnEnterAnimation({ duration: 500 })
  ],
})
export class BandejaEntradaComponent implements OnInit {

  spiner_carga: boolean = false

  Tramites_Recibidos: BandejaEntradaModel_View[] = []
  modo_busqueda: boolean = false
  displayedColumns: string[] = ['interno', 'alterno', 'titulo', 'emisor', 'estado', 'fecha', 'opciones']

  dataSource = new MatTableDataSource();
  Total: number = 0
  paginator: number = 0
  items_page: number = 10
  cargando: boolean = false
  termino_busqueda: string = ""

  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement: any | null;




  constructor(private loginService: LoginService, private socketService: SocketService, private bandejaService: BandejaService, private workflowService: WorkflowService, private dialog: MatDialog, private registrTramiteService: RegistroTramitesService) {
  }

  ngOnInit(): void {
    this.recibir_tramite()
    this.obtener_tramitesRecibidos()




  }

  recibir_tramite() {
    this.socketService.Escuchar('recibir_tramite').subscribe((mail: any) => {
      console.log(mail);
      this.Tramites_Recibidos.unshift(mail)
      if (this.Tramites_Recibidos.length > this.items_page) {
        this.Tramites_Recibidos.pop()
      }
      this.dataSource.data = this.Tramites_Recibidos
    })
  }
  obtener_tramitesRecibidos() {
    this.spiner_carga = true
    this.Tramites_Recibidos = []
    this.bandejaService.getBandejaEntrada(this.paginator, this.items_page).subscribe(bandeja => {
      this.spiner_carga = false
      this.Tramites_Recibidos = bandeja.bandeja
      this.Total = bandeja.total
      this.dataSource.data = this.Tramites_Recibidos
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



  recargar() {
    this.obtener_tramitesRecibidos()
  }
  activar_busqueda() {
    this.modo_busqueda = true
  }
  desactivar_busqueda() {
    this.modo_busqueda = false
    this.dataSource.filter = ""
  }



  aceptar_tramite(tramite_recibido: BandejaEntradaModel_View) {
    this.bandejaService.aceptar_Tramite(tramite_recibido.id_tramite, tramite_recibido.id_cuentaEmisor).subscribe(mensage => {
      const index = this.Tramites_Recibidos.findIndex(tramite => tramite.id_tramite == tramite_recibido.id_tramite);
      this.Tramites_Recibidos[index].aceptado = true;
      this.dataSource.data = this.Tramites_Recibidos;
    })

  }
  rechazar_tramite(tramite_recibido: any) {
    Swal.fire({
      title: `Ingrese el motivo para el rechazo del tramite`,
      text: `El tramite ${tramite_recibido.alterno} recibido de ${tramite_recibido.cargo} sera rechazado.`,
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#38B000',
      cancelButtonColor: '#F94144',
      icon: 'question'
    }).then((result) => {
      if (result.isConfirmed) {
        if (!result.value) {
          Swal.fire({
            title: `Debe ingresar el motivo del rechazo`,
            icon: 'error'
          })
        }
        else {
          //enviar datos para eliminar el registro unico con id_tramite, id_cuentaEmisor, id_cuentaRecpetor
          this.bandejaService.rechazar_Tramite(tramite_recibido.id_tramite, tramite_recibido.id_cuentaEmisor, this.loginService.Detalles_Cuenta.id_cuenta, result.value).subscribe((resp: any) => {
            if (resp.ok) {
              //mensaje de aceptado
              this.Tramites_Recibidos = this.Tramites_Recibidos.filter((tramite) => tramite.id_tramite !== tramite_recibido.id_tramite);
              this.dataSource.data = this.Tramites_Recibidos
            }
          })
        }
      }
    })
  }

  remitir_tramite(tramite_recibido: BandejaEntradaModel_View) {
    let mail: MailModel = {
      id_tramite: tramite_recibido.id_tramite,
      titulo: tramite_recibido.titulo,
      alterno: tramite_recibido.alterno,
      estado: tramite_recibido.estado,
      externo: tramite_recibido.externo
    }
    const dialogRef = this.dialog.open(DialogRemisionComponent, {
      data: mail
    });
    dialogRef.afterClosed().subscribe((dataDialog: any) => {
      if (dataDialog) {
        this.Tramites_Recibidos = this.Tramites_Recibidos.filter((tramite) => tramite.id_tramite !== tramite_recibido.id_tramite);
        this.dataSource.data = this.Tramites_Recibidos
      }
    })

  }

  finalizar_tramite(tramite_recibido: any) {
    Swal.fire({
      title: `Finalizar el tramite ${tramite_recibido.alterno}?`,
      text: 'El tramite sera marcado como concluido',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#38B000',
      cancelButtonColor: '#F94144',
      icon: 'question'
    }).then((result) => {
      if (result.isConfirmed) {
        this.registrTramiteService.putSolicitud(null, null, {
          id_tramite: tramite_recibido.id_tramite,
          estado: 'Concluido',
          fecha_finalizacion: (new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, 19).replace('T', ' ')
        },
          null).subscribe((resp: any) => {
            this.Tramites_Recibidos = this.Tramites_Recibidos.filter((tramite) => tramite.id_tramite !== tramite_recibido.id_tramite);
            this.dataSource.data = this.Tramites_Recibidos
          })
      }
    })
  }


  cambiar_paginacion(evento: any) {
    this.items_page = evento.pageSize
    if (evento.pageIndex > evento.previousPageIndex) {
      this.paginator = this.paginator + 5
    }
    else if (evento.pageIndex < evento.previousPageIndex) {
      this.paginator = this.paginator - 5
      if (this.paginator < 0) {
        this.paginator = 0
      }
    }
    this.obtener_tramitesRecibidos()
  }



}
