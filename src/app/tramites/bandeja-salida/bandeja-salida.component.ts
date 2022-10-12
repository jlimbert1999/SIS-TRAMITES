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
  columnsToDisplayWithExpand = ['externo', 'titulo', 'alterno', 'emisor', 'fecha_envio', 'situacion', 'opciones', 'expand'];
  modo_busqueda: boolean = false
  spiner_carga: boolean = false
  expandedElement: any | null;
  permisos = this.loginService.Detalles_Cuenta.permiso

  constructor(private bandejaService: BandejaService, private loginService: LoginService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.obtener_bandejaSalida()
  }

  obtener_bandejaSalida() {
    this.spiner_carga = true
    this.bandejaService.getBandejaSalida().subscribe(resp => {
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
    let time = new Date()
    let fecha = moment(time).format('DD-MM-YYYY HH:mm:ss');
    let img = new Image()
    img.src = '../../../assets/img/logo_alcaldia.png'
    //horizonal, vertical
    const doc = new jsPDF();

    //CREACION CABECERA
    doc.addImage(img, 'png', 10, 1, 30, 30)
    doc.setFont("helvetica", "bold");
    doc.text("Hoja de ruta", 105, 20, undefined, "center");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Impreso: ${fecha}`, 200, 20, undefined, "right");
    doc.line(200, 30, 10, 30);

    doc.rect(15, 55, 180, 80);

    doc.setFontSize(7);
    doc.text("CORRESPONDENCIA", 30, 40, undefined, "center");
    doc.text("INTERNA", 30, 43, undefined, "center");
    doc.rect(47, 38, 5, 5);

    doc.text("COPIA", 55, 40);
    doc.rect(67, 38, 5, 5);

    doc.text("CORRESPONDENCIA", 90, 40, undefined, "center");
    doc.text("EXTERNA", 90, 43, undefined, "center");
    doc.rect(105, 38, 5, 5);
    doc.rect(105, 38, 5, 5, "F"); //MARCAR COMO EXTERNO

    doc.text("NRO. UNICO DE ", 130, 40, undefined, "center");
    doc.text("CORRESPONDENCIA", 130, 43, undefined, "center");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(`${mail.alterno}`, 150, 42);
    doc.rect(145, 36, 50, 9);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);

    doc.text("EMISION / RECEPCION: ", 70, 50);
    doc.rect(98, 47, 16, 5);
    doc.rect(118, 47, 16, 5);
    doc.text(`${moment(mail.fecha_envio).format('DD-MM-YYYY')}`, 100, 50);
    doc.text(`${moment(mail.fecha_recibido).format('HH:mm a')}`, 120, 50);
    doc.text("DATOS DE ORIGEN", 20, 60);
    doc.text(`CITE: ${mail.cite}`.toUpperCase(), 20, 65);
    doc.line(27, 66, 95, 66); // ( punto ini, pos izq, punto fin, pos der)


    doc.text("NRO DE REGISTRO INTERNO (Correlativo)", 100, 65);
    doc.rect(160, 61, 20, 6);

    doc.text(`REMITENTE: ${mail.funcionario_emisor}`, 20, 75);
    doc.line(35, 76, 90, 76);
    doc.text(`CARGO: P. ${this.loginService.Detalles_Cuenta.cargo}`, 100, 75);
    doc.line(110, 76, 170, 76);

    doc.text(`DESTINATARIO: ${mail.funcionario_receptor} `, 20, 80);
    doc.line(37, 81, 92, 81);
    doc.text(`CARGO: ${mail.cargo}`, 100, 80);
    doc.line(110, 81, 170, 81);

    doc.text(`REFERENCIA: ${mail.titulo} `, 20, 85);
    doc.line(35, 86, 170, 86);

    doc.text("SALIDA: ", 85, 90);
    doc.rect(98, 87, 16, 5);
    doc.rect(118, 87, 16, 5);
    doc.text(`${moment(mail.fecha_envio).format('DD-MM-YYYY')}`, 100, 90);
    doc.text(`${moment(mail.fecha_envio).format('HH:mm a')}`, 120, 90);

    doc.text(`Destinatario 1: ${mail.funcionario_receptor} (${mail.cargo})`, 20, 95);
    doc.line(35, 96, 120, 96);
    doc.rect(20, 97, 30, 30);
    doc.text("Instruccion / Proveido ", 55, 105);
    doc.text(`${mail.detalle}`, 55, 110);
    doc.text("NRO. DE REGISTRO INTERNO (Correlativo)", 100, 100);
    doc.rect(160, 96, 20, 6);

    doc.line(180, 121, 140, 121); // horizontal line (largo, altura lado izq, posicion horizontal, altura lado der)
    doc.text("Firma y sello", 150, 125);

    doc.setFontSize(6);
    doc.text(`Fecha`, 60, 128);
    doc.text(`Hora`, 80, 128);
    doc.text(`Fecha`, 150, 128);
    doc.text(`Hora`, 170, 128);
    doc.setFontSize(7);

    doc.text(`INGRESO:`, 40, 132);
    doc.rect(55, 129, 16, 5);
    doc.rect(76, 129, 16, 5);

    doc.text(`SALIDA:`, 130, 132);
    doc.rect(145, 129, 16, 5);
    doc.rect(166, 129, 16, 5);

    let pos_Y = 142

    for (let i = 1; i < 3; i++) {
      doc.rect(15, pos_Y - 4, 180, 50);
      doc.text(`Destinatario ${i + 1}:`, 20, pos_Y);
      doc.line(35, pos_Y + 1, 120, pos_Y + 1);
      doc.rect(20, pos_Y + 2, 30, 30);
      doc.text("Instruccion / Proveido ", 55, pos_Y + 10);
      doc.text("NRO. DE REGISTRO INTERNO (Correlativo)", 100, pos_Y + 5);
      doc.rect(160, pos_Y + 1, 20, 6);

      doc.line(180, pos_Y + 26, 140, pos_Y + 26); // horizontal line (largo, altura lado izq, posicion horizontal, altura lado der)
      doc.text("Firma y sello", 150, pos_Y + 30);

      doc.setFontSize(6);
      doc.text(`Fecha`, 60, pos_Y + 33);
      doc.text(`Hora`, 80, pos_Y + 33);
      doc.text(`Fecha`, 150, pos_Y + 33);
      doc.text(`Hora`, 170, pos_Y + 33);
      doc.setFontSize(7);

      doc.text(`INGRESO`, 40, pos_Y + 37);
      doc.rect(55, pos_Y + 34, 16, 5);
      doc.rect(76, pos_Y + 34, 16, 5);
      doc.text(`SALIDA`, 130, pos_Y + 37);
      doc.rect(145, pos_Y + 34, 16, 5);
      doc.rect(166, pos_Y + 34, 16, 5)
      pos_Y = pos_Y + 55
    }
    doc.text(`Nota: Esta hoja de ruta unica de correspondencia, no debera ser separada ni extraviada del documento al cual se encuentra adherida`, 20, 270);
    doc.addPage();
    pos_Y = 20
    for (let i = 3; i < 8; i++) {
      doc.rect(15, pos_Y - 4, 180, 50);
      doc.text(`Destinatario ${i + 1}:`, 20, pos_Y);
      doc.line(35, pos_Y + 1, 120, pos_Y + 1);
      doc.rect(20, pos_Y + 2, 30, 30);
      doc.text("Instruccion / Proveido ", 55, pos_Y + 10);
      doc.text("NRO. DE REGISTRO INTERNO (Correlativo)", 100, pos_Y + 5);
      doc.rect(160, pos_Y + 1, 20, 6);

      doc.line(180, pos_Y + 26, 140, pos_Y + 26); // horizontal line (largo, altura lado izq, posicion horizontal, altura lado der)
      doc.text("Firma y sello", 150, pos_Y + 30);

      doc.setFontSize(6);
      doc.text(`Fecha`, 60, pos_Y + 33);
      doc.text(`Hora`, 80, pos_Y + 33);
      doc.text(`Fecha`, 150, pos_Y + 33);
      doc.text(`Hora`, 170, pos_Y + 33);
      doc.setFontSize(7);

      doc.text(`INGRESO`, 40, pos_Y + 37);
      doc.rect(55, pos_Y + 34, 16, 5);
      doc.rect(76, pos_Y + 34, 16, 5);
      doc.text(`SALIDA`, 130, pos_Y + 37);
      doc.rect(145, pos_Y + 34, 16, 5);
      doc.rect(166, pos_Y + 34, 16, 5)
      pos_Y = pos_Y + 55
    }
    doc.output('dataurlnewwindow')

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


