import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { MatPaginator } from '@angular/material/paginator';

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

  Tramites_Recibidos: BandejaEntradaModel_View[] = []
  displayedColumns: string[] = ['interno', 'alterno', 'titulo', 'emisor', 'estado', 'fecha', 'opciones']

  dataSource = new MatTableDataSource();


  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement: any | null;

  @ViewChild("myInput") private myInput: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  isLoadingResults = true;

  constructor(private loginService: LoginService, private socketService: SocketService, public bandejaService: BandejaService, private workflowService: WorkflowService, private dialog: MatDialog, private registrTramiteService: RegistroTramitesService) {
  }

  ngOnInit(): void {
    this.recibir_tramite()
    this.obtener_tramitesRecibidos()




  }

  recibir_tramite() {
    this.socketService.Escuchar('recibir_tramite').subscribe((mail: any) => {
      this.Tramites_Recibidos.unshift(mail)
      if (this.Tramites_Recibidos.length > this.bandejaService.dataSize) {
        this.Tramites_Recibidos.pop()
      }
      this.dataSource.data = this.Tramites_Recibidos
    })
  }
  obtener_tramitesRecibidos() {
    this.isLoadingResults = true
    if (this.bandejaService.termino_busqueda_mailIn !== "") {
      this.bandejaService.searchBandejaEntrada().subscribe(data => {
        this.Tramites_Recibidos = data
        this.dataSource.data = this.Tramites_Recibidos
        this.isLoadingResults = false
      })
    }
    else {
      this.bandejaService.getBandejaEntrada().subscribe(data => {
        this.Tramites_Recibidos = data
        this.dataSource.data = this.Tramites_Recibidos
        this.paginator.pageIndex = this.bandejaService.pageIndex_mailIn
        this.isLoadingResults = false
      })
    }

  }

  applyFilter() {
    if (this.bandejaService.termino_busqueda_mailIn !== '') {
      this.bandejaService.pageIndex_mailIn = 0
      this.bandejaService.searchBandejaEntrada().subscribe(data => {
        this.Tramites_Recibidos = data
        this.dataSource.data = this.Tramites_Recibidos
        this.paginator.pageIndex = 0
      })
    }
  }



  recargar() {
    this.obtener_tramitesRecibidos()
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
    this.bandejaService.pageIndex_mailIn = evento.pageIndex
    this.bandejaService.rows_mailIn = evento.pageSize
    this.obtener_tramitesRecibidos()
  }
  activar_busqueda() {
    this.bandejaService.modo_busqueda_mailIn = true
    setTimeout(() => {
      this.myInput.nativeElement.focus()
    })
  }
  desactivar_busqueda() {
    this.bandejaService.termino_busqueda_mailIn = ""
    this.bandejaService.modo_busqueda_mailIn = false
    this.bandejaService.pageIndex_mailIn = 0
    this.obtener_tramitesRecibidos()
  }


}
