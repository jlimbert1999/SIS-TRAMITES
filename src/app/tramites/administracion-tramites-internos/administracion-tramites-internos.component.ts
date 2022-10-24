import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DialogRemisionComponent } from '../adminitracion-tramites/dialog-remision/dialog-remision.component';
import { TramiteInternoModel_View } from '../models/tramite.model';
import { RegistroTramitesService } from '../services/registro-tramites.service';
import { DialogRegistroInternoComponent } from './dialog-registro-interno/dialog-registro-interno.component';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { generar_hoja_ruta_interno } from 'src/app/generacion-pdfs/generacion-pdf';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { catchError, map, merge, startWith, switchMap, of } from 'rxjs';

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
  displayedColumns = ["enviado", "alterno", "titulo", "remitente", "destinatario", "estado", "cite", "fecha_creacion", "opciones"]
  modo_busqueda: boolean = false;
  isLoadingResults = true;

  @ViewChild("myInput") private myInput: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    public tramiteService: RegistroTramitesService
  ) { }
 
  ngOnInit(): void {
    console.log(this.tramiteService.pageIndex_interno );
    if (this.tramiteService.termino_busqueda !== '') {
      this.buscar_tramite()
    }
    else{
      this.obtener_tramites_interno()
    }
   
  }

  registrar_tramite_interno() {
    const dialogRef = this.dialog.open(DialogRegistroInternoComponent, {
      width: '900px'
    });
    dialogRef.afterClosed().subscribe((dataDialog: any) => {
      if (dataDialog) {
        this.Tramites.unshift(dataDialog)
        this.dataSource.data = this.Tramites
        this.abrir_DialogRemision(dataDialog)

      }
    });
  }
  obtener_tramites_interno() {
    this.isLoadingResults = true
    this.tramiteService.getTramites_internos().subscribe(data => {
      this.dataSource.data = data
      this.isLoadingResults = false
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

  buscar_tramite() {
    if (this.tramiteService.termino_busqueda !== '') {
      this.paginator.pageIndex = 0
      this.tramiteService.buscar_tramite_interno(this.tramiteService.termino_busqueda).subscribe(tramites => {
        this.Tramites = tramites
        this.dataSource.data = this.Tramites
      })
    }

  }

  desactivar_busqueda() {
    this.tramiteService.termino_busqueda = ""
    this.tramiteService.modo_busqueda = false
    this.obtener_tramites_interno()
  }

  generar_hoja_ruta(Tramite: TramiteInternoModel_View) {
    this.tramiteService.obtener_hoja_ruta(Tramite.id_tramite, 'interno').subscribe(data => {
      generar_hoja_ruta_interno(data.tramite, data.fecha_generacion)
    })

  }

  cambiar_paginacion(evento: any) {
    this.tramiteService.pageIndex_interno = evento.pageIndex
    this.tramiteService.rows_interno = evento.pageSize
    this.obtener_tramites_interno()
  }
  activar_busqueda() {
    this.tramiteService.modo_busqueda = true
    setTimeout(() => {
      this.myInput.nativeElement.focus()
    })
  }

}
function observableOf(arg0: null) {
  throw new Error('Function not implemented.');
}

