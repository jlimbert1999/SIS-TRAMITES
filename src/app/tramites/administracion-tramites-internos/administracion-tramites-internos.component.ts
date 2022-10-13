import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DialogRemisionComponent } from '../adminitracion-tramites/dialog-remision/dialog-remision.component';
import { TramiteInternoModel_View } from '../models/tramite.model';
import { RegistroTramitesInternosService } from '../services/registro-tramites-internos.service';
import { RegistroTramitesService } from '../services/registro-tramites.service';
import { DialogRegistroInternoComponent } from './dialog-registro-interno/dialog-registro-interno.component';
import jsPDF from 'jspdf';
import * as moment from 'moment';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { generar_hoja_ruta_interno } from 'src/app/generacion-pdfs/generacion-pdf';
import { PaginationService } from '../services/pagination.service';

@Component({
  selector: 'app-administracion-tramites-internos',
  templateUrl: './administracion-tramites-internos.component.html',
  styleUrls: ['./administracion-tramites-internos.component.css'],
  animations: [
    fadeInOnEnterAnimation({ duration: 500 })
  ]

})
export class AdministracionTramitesInternosComponent implements OnInit {
  Tramites: TramiteInternoModel_View[] = []
  dataSource = new MatTableDataSource();
  displayedColumns = ["enviado", "alterno", "titulo", "remitente", "destinatario", "estado", "fecha_creacion", "cite", "opciones"]

  Total: number = 0
  paginator: number = 0
  items_page: number = 10
  termino_busqueda: string
  modo_busqueda: boolean = false;
  carga_spiner = false
  constructor(
    public dialog: MatDialog,
    private tramiteService: RegistroTramitesService,
    private paginationService:PaginationService
  ) { }

  ngOnInit(): void {
    this.obtener_tramites_interno()
  }

  registrar_tramite_interno() {
    const dialogRef = this.dialog.open(DialogRegistroInternoComponent, {
      width: '900px'
    });
    dialogRef.afterClosed().subscribe((dataDialog: any) => {
      if (dataDialog) {
        this.Tramites.unshift(dataDialog)
        this.dataSource.data = this.Tramites
        console.log(dataDialog);
        this.abrir_DialogRemision(dataDialog)

      }
    });
  }
  obtener_tramites_interno() {
    this.carga_spiner = true
    this.tramiteService.getTramites_internos().subscribe(tramites => {
      console.log(tramites);
      this.Total = tramites.total
      this.carga_spiner = false
      this.Tramites = tramites.Tramites
      this.dataSource.data = this.Tramites
    })
  }
  editar_tramite(datosTramite: TramiteInternoModel_View) {
    const dialogRef = this.dialog.open(DialogRegistroInternoComponent, {
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

  abrir_DialogRemision(tramite: any) {
    let mail = {
      id_tramite: tramite.id_tramite,
      titulo: tramite.titulo,
      alterno: tramite.alterno,
      estado: tramite.estado,
      externo: false
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

  aplicarFiltro(event: Event) {
    // const filterValue = (event.target as HTMLInputElement).value;
    // if (filterValue !== '') {
    //   this.tramiteService.buscar_tramite(filterValue).subscribe(tramites => {
    //     this.Tramites = tramites
    //   })
    // }
    // else {
    //   this.obtener_tramites()
    // }
  }

  desactivar_busqueda() {
    this.paginator = 0
    this.termino_busqueda = ""
    // this.obtener_tramites()
  }

  generar_hoja_ruta(Tramite: TramiteInternoModel_View) {
    this.tramiteService.obtener_hoja_ruta(Tramite.id_tramite, 'interno').subscribe(data=>{
      generar_hoja_ruta_interno(data.tramite, data.fecha_generacion)
    })
   
  }

}
