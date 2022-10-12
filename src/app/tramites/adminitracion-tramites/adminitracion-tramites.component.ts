import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/auth/services/login.service';
import { TramiteModel_View, Tramite_Model } from '../models/tramite.model';
import { RegistroTramitesService } from '../services/registro-tramites.service';
import { DialogRegistroTramiteComponent } from './dialog-registro-tramite/dialog-registro-tramite.component';
import { jsPDF } from 'jspdf';
import { DialogRemisionComponent } from './dialog-remision/dialog-remision.component';
import { fadeInOnEnterAnimation } from 'angular-animations';
import * as moment from 'moment';
import { generar_hoja_ruta, generar_ficha_tramite } from 'src/app/generacion-pdfs/generacion-pdf';
import { PaginationService } from '../services/pagination.service';
@Component({
  selector: 'app-adminitracion-tramites',
  templateUrl: './adminitracion-tramites.component.html',
  styleUrls: ['./adminitracion-tramites.component.css'],
  animations: [
    fadeInOnEnterAnimation({ duration: 500 })
  ]

})

export class AdminitracionTramitesComponent implements OnInit {
  Tramites: TramiteModel_View[] = []
  Total: number = 0
  dataSource = new MatTableDataSource();
  displayedColumns = ["enviado", "alterno", "titulo", "solicitante", "estado", "fecha_creacion", "opciones"]
  @ViewChild("myInput") private myInput: ElementRef;
  cargando: boolean = false


  constructor(
    private tramiteService: RegistroTramitesService,
    public dialog: MatDialog,
    public pagitationService: PaginationService
  ) {

  }




  ngOnInit(): void {
    if (this.pagitationService.termino_busqueda != "") {
      this.buscar_tramite()
    }
    else {

      this.obtener_tramites()
    }
    
  }


  obtener_tramites() {
    this.cargando = true
    this.tramiteService.getTramites(this.pagitationService.paginator, this.pagitationService.items_page).subscribe(data => {
      this.cargando = false
      this.Tramites = data.tramites
      this.dataSource.data = this.Tramites
      this.Total = data.total
    })

  }


  registrar_Tramite() {
    this.tramiteService.paginacion++
    const dialogRef = this.dialog.open(DialogRegistroTramiteComponent, {
      data: {},
      width: '900px'
    });
    dialogRef.afterClosed().subscribe((dataDialog: TramiteModel_View) => {
      if (dataDialog) {
        this.Tramites.unshift(dataDialog)
        this.Total = this.Total + 1
        if (this.Total > this.pagitationService.items_page) {
          this.Tramites.pop()
        }
        this.dataSource.data = this.Tramites
        this.abrir_DialogRemision(dataDialog)
      }
    });
  }
  editar_tramite(datosTramite: any) {
    const dialogRef = this.dialog.open(DialogRegistroTramiteComponent, {
      data: datosTramite,
      width: '900px'
    });
    dialogRef.afterClosed().subscribe((dataDialog: any) => {
      if (dataDialog) {
        const rightIndex = this.Tramites.findIndex((item: any) => item.id_tramite == dataDialog.id_tramite);
        this.Tramites[rightIndex] = dataDialog;
        this.dataSource.data = this.Tramites
      }
    });
  }

  imprimir_ficha(tramite: TramiteModel_View) {
    generar_ficha_tramite(tramite)
  }

  generar_hoja_ruta(tramite: TramiteModel_View) {
    this.tramiteService.obtener_hoja_ruta(tramite.id_tramite, 'externo').subscribe(data => {
      generar_hoja_ruta(data)
    })
  }





  agrupar_tramites(estado: string) {
    if (estado == 'Todos') {
      this.dataSource.data = this.Tramites
    }
    else {
      this.dataSource.data = this.Tramites.filter((elemet: any) => elemet.estado == estado)
    }
  }

  abrir_DialogRemision(tramite: any) {

    let mail = {
      id_tramite: tramite.id_tramite,
      titulo: tramite.titulo,
      alterno: tramite.alterno,
      estado: tramite.estado,
      externo: true
    }
    const dialogRef = this.dialog.open(DialogRemisionComponent, {
      data: mail
    });
    dialogRef.afterClosed().subscribe((dataDialog: any) => {
      if (dataDialog) {
        const rightIndex = this.Tramites.findIndex((item: any) => item.id_tramite == dataDialog.id_tramite);
        this.Tramites[rightIndex].enviado = true;
        this.Tramites[rightIndex].estado = dataDialog.estado;
        this.dataSource.data = this.Tramites
      }
    });
  }

  cambiar_paginacion(evento: any) {
    this.pagitationService.items_page = evento.pageSize
    this.pagitationService.pageIndex = evento.pageIndex
    if (evento.pageIndex > evento.previousPageIndex) {
      this.pagitationService.next_page()
    }
    else if (evento.pageIndex < evento.previousPageIndex) {
      this.pagitationService.previus_page()
    }

    this.obtener_tramites()

  }

  buscar_tramite() {
    this.tramiteService.buscar_tramite(this.pagitationService.termino_busqueda).subscribe(tramites => {
      this.Tramites = tramites
      this.dataSource.data = this.Tramites
    })
  }
  activar_busqueda() {
    this.pagitationService.modo_busqueda = true
    setTimeout(() => {
      this.myInput.nativeElement.focus()
    })
  }

  desactivar_busqueda() {
    this.pagitationService.termino_busqueda = ""
    this.pagitationService.modo_busqueda = false
    this.obtener_tramites()
  }


}
