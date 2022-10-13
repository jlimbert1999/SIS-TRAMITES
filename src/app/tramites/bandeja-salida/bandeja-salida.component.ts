import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BandejaSalidaModel_View, MailModel } from '../models/mail.model';
import { BandejaService } from '../services/bandeja.service';
import jsPDF from 'jspdf';
import { LoginService } from 'src/app/auth/services/login.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DialogRemisionComponent } from '../adminitracion-tramites/dialog-remision/dialog-remision.component';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';

import { fadeInOnEnterAnimation } from 'angular-animations';
import { generar_hoja_ruta, generar_hoja_ruta_interno } from 'src/app/generacion-pdfs/generacion-pdf';
import { RegistroTramitesService } from '../services/registro-tramites.service';

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
  Tramites_Emitidos: BandejaSalidaModel_View[] = []
  dataSource = new MatTableDataSource();
  columnsToDisplayWithExpand = ['externo', 'titulo', 'alterno', 'emisor', 'estado','fecha_envio', 'situacion', 'opciones', 'expand'];
  modo_busqueda: boolean = false
  spiner_carga: boolean = false
  expandedElement: any | null;
  permisos = this.loginService.Detalles_Cuenta.permiso

  constructor(private bandejaService: BandejaService, private loginService: LoginService, private dialog: MatDialog, private tramiteService: RegistroTramitesService) { }

  ngOnInit(): void {
    this.obtener_bandejaSalida()
  }

  obtener_bandejaSalida() {
    this.spiner_carga = true
    this.bandejaService.getBandejaSalida().subscribe(resp => {
      console.log(resp);
      this.spiner_carga = false
      this.Tramites_Emitidos = resp.bandeja
      this.dataSource.data = this.Tramites_Emitidos
    })

  }

  applyFilter(evento: any) {

  }
  desactivar_busqueda() {
    this.modo_busqueda = false


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
      this.tramiteService.obtener_hoja_ruta(mail.id_tramite, 'interno').subscribe(data=>{
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

}


