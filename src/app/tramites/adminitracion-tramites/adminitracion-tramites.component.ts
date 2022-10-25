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
import { MatPaginator } from '@angular/material/paginator';
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

  dataSource = new MatTableDataSource();
  displayedColumns = ["enviado", "alterno", "titulo", "solicitante", "dni", "estado", "fecha_creacion", "opciones"]
  isLoadingResults = true;
  @ViewChild("myInput") private myInput: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(
    public tramiteService: RegistroTramitesService,
    public dialog: MatDialog,
    public pagitationService: PaginationService
  ) {


  }




  ngOnInit(): void {
    this.obtener_tramites()

  }


  obtener_tramites() {
    this.isLoadingResults = true
    if (this.tramiteService.termino_busqueda_externo !== "") {
      // this.tramiteService.buscar_tramite_interno().subscribe(tramites => {
      //   this.Tramites = tramites
      //   this.dataSource.data = this.Tramites
      //   this.isLoadingResults = false
      // })
    }
    else {
      this.tramiteService.getTramites().subscribe(data => {
        this.Tramites = data
        this.dataSource.data = this.Tramites
        this.paginator.pageIndex = this.tramiteService.pageIndex_externo
        this.isLoadingResults = false
      })
    }


  }


  registrar_Tramite() {
    const dialogRef = this.dialog.open(DialogRegistroTramiteComponent, {
      width: '900px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((dataDialog: TramiteModel_View) => {
      if (dataDialog) {
        this.Tramites.unshift(dataDialog)
        this.tramiteService.dataSize = this.tramiteService.dataSize + 1
        if (this.Tramites.length > this.tramiteService.rows_externo) {
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



  buscar_tramite() {
    if (this.tramiteService.termino_busqueda_externo !== '') {
      this.tramiteService.pageIndex_externo = 0
      this.tramiteService.buscar_tramite(this.tramiteService.termino_busqueda_externo).subscribe(tramites => {
        this.Tramites = tramites
        this.dataSource.data = this.Tramites
        this.paginator.pageIndex = 0
      })
    }
  }
  generar_hoja_ruta(tramite: TramiteModel_View) {
    this.tramiteService.obtener_hoja_ruta(tramite.id_tramite, 'externo').subscribe(data => {
      generar_hoja_ruta(data.tramite, data.fecha_generacion)
    })
  }


  cambiar_paginacion(evento: any) {
    this.tramiteService.pageIndex_externo = evento.pageIndex
    this.tramiteService.rows_externo = evento.pageSize
    this.obtener_tramites()
  }
  activar_busqueda() {
    this.tramiteService.modo_busqueda_externo = true
    setTimeout(() => {
      this.myInput.nativeElement.focus()
    })
  }

  desactivar_busqueda() {
    this.tramiteService.termino_busqueda_externo = ""
    this.tramiteService.modo_busqueda_externo = false
    this.tramiteService.pageIndex_externo = 0
    this.obtener_tramites()
  }


}
