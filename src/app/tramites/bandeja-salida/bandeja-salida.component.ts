import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BandejaSalidaModel_View, MailModel } from '../models/mail.model';
import { BandejaService } from '../services/bandeja.service';
import { LoginService } from 'src/app/auth/services/login.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DialogRemisionComponent } from '../adminitracion-tramites/dialog-remision/dialog-remision.component';
import { MatDialog } from '@angular/material/dialog';

import { fadeInOnEnterAnimation } from 'angular-animations';
import { generar_hoja_ruta, generar_hoja_ruta_interno } from 'src/app/generacion-pdfs/generacion-pdf';
import { RegistroTramitesService } from '../services/registro-tramites.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-bandeja-salida',
  templateUrl: './bandeja-salida.component.html',
  styleUrls: ['./bandeja-salida.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    fadeInOnEnterAnimation({ duration: 500 })
  ]
})
export class BandejaSalidaComponent implements OnInit {
  isLoadingResults = true;
  Tramites_Emitidos: BandejaSalidaModel_View[] = []
  dataSource = new MatTableDataSource();
  columnsToDisplayWithExpand = ['externo', 'titulo', 'alterno', 'emisor', 'estado', 'fecha_envio', 'situacion', 'opciones', 'expand'];
  modo_busqueda: boolean = false
  spiner_carga: boolean = false
  expandedElement: any | null;
  permisos = this.loginService.Detalles_Cuenta.permiso


  @ViewChild("myInput") private myInput: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public bandejaService: BandejaService, private loginService: LoginService, private dialog: MatDialog, private tramiteService: RegistroTramitesService) { }

  ngOnInit(): void {
    this.obtener_bandejaSalida()
  }

  obtener_bandejaSalida() {
    this.isLoadingResults = true
    if (this.bandejaService.termino_busqueda_mailOut !== "") {
      this.bandejaService.searchBandejaSalida().subscribe(data => {
        this.Tramites_Emitidos = data
        this.dataSource.data = this.Tramites_Emitidos
        this.isLoadingResults = false
      })
    }
    else {
      this.bandejaService.getBandejaSalida().subscribe(data => {
        this.Tramites_Emitidos = data
        this.dataSource.data = this.Tramites_Emitidos
        this.paginator.pageIndex = this.bandejaService.pageIndex_mailOut
        this.isLoadingResults = false
      })
    }

  }



  recargar() {
    this.obtener_bandejaSalida()
  }


  crear_hoja_ruta(mail: BandejaSalidaModel_View) {
    if (mail.externo) {
      this.tramiteService.obtener_hoja_ruta(mail.id_tramite, 'externo').subscribe(data => {
        generar_hoja_ruta(data.tramite, data.fecha_generacion)
      })
    }
    else {
      this.tramiteService.obtener_hoja_ruta(mail.id_tramite, 'interno').subscribe(data => {
        generar_hoja_ruta_interno(data.tramite, data.fecha_generacion)
      })
    }



  }
  reenviar_tramite(tramite_enviado: BandejaSalidaModel_View) {
    let mail: MailModel = {
      id_tramite: tramite_enviado.id_tramite,
      titulo: tramite_enviado.titulo,
      alterno: tramite_enviado.alterno,
      estado: tramite_enviado.estado,
      externo: tramite_enviado.externo
    }
    const dialogRef = this.dialog.open(DialogRemisionComponent, {
      data: mail
    });
    dialogRef.afterClosed().subscribe((dataDialog: any) => {
      if (dataDialog) {
        const index = this.Tramites_Emitidos.findIndex((item: any) => item.id_tramite == mail.id_tramite);
        this.Tramites_Emitidos[index].reenviado = true;
        this.Tramites_Emitidos.unshift(dataDialog)
        this.dataSource.data = this.Tramites_Emitidos
      }
    })

  }

  applyFilter() {
    if (this.bandejaService.termino_busqueda_mailOut !== '') {
      this.bandejaService.pageIndex_mailOut = 0
      this.bandejaService.searchBandejaSalida().subscribe(data => {
        this.Tramites_Emitidos = data
        this.dataSource.data = this.Tramites_Emitidos
        this.paginator.pageIndex = 0
      })
    }
  }

  activar_busqueda() {
    this.bandejaService.modo_busqueda_mailOut = true
    setTimeout(() => {
      this.myInput.nativeElement.focus()
    })
  }
  desactivar_busqueda() {
    this.bandejaService.termino_busqueda_mailOut = ""
    this.bandejaService.modo_busqueda_mailOut = false
    this.bandejaService.pageIndex_mailOut = 0
    this.obtener_bandejaSalida()

  }

  cambiar_paginacion(evento: any) {
    this.bandejaService.pageIndex_mailOut = evento.pageIndex
    this.bandejaService.rows_mailOut = evento.pageSize
    this.obtener_bandejaSalida()
  }

}


